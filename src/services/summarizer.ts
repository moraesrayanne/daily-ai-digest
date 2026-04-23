import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../types';
import aiStyle from '../../config/ai-style.json';

const DELAY_BETWEEN_MS = 5000;
const MAX_RETRIES = 3;

let dailyQuotaExhausted = false;

function buildPrompt(article: Article): string {
  return (
    `Você é um assistente que resume artigos de tecnologia em tom ${aiStyle.tone}, em ${aiStyle.language}.\n` +
    `Responda APENAS com um JSON válido, sem markdown, sem explicações:\n` +
    `{"title": "<título traduzido para português>", "summary": "<resumo em exatamente 2 linhas>"}\n\n` +
    `Título original: ${article.title}\nURL: ${article.url}`
  );
}

interface SummaryResult {
  title: string;
  summary: string;
}

function parseResult(text: string, article: Article): SummaryResult {
  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (json) {
      const parsed = JSON.parse(json);
      if (parsed.title && parsed.summary) return parsed;
    }
  } catch { /* fallback below */ }
  return { title: article.title, summary: text.trim() };
}

function fallback(_article: Article): SummaryResult {
  return { title: _article.title, summary: 'Resumo indisponível no momento. Clique para ler o artigo completo.' };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDaily429(err: unknown): boolean {
  const violations: any[] = (err as any)?.errorDetails?.find(
    (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure'
  )?.violations ?? [];
  return violations.some((v) => String(v.quotaId ?? '').includes('PerDay'));
}

function retryDelayMs(err: unknown): number {
  const detail = (err as any)?.errorDetails?.find(
    (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
  );
  if (!detail?.retryDelay) return 60_000;
  const seconds = parseFloat(detail.retryDelay);
  return isNaN(seconds) ? 60_000 : seconds * 1000 + 1000;
}

export async function summarize(article: Article): Promise<SummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || process.env.SKIP_SUMMARIZE === 'true' || dailyQuotaExhausted) {
    return fallback(article);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(buildPrompt(article));
      return parseResult(result.response.text().trim(), article);
    } catch (err) {
      const status = (err as any)?.status;

      if (status === 429 && isDaily429(err)) {
        console.warn('[summarizer] daily quota exhausted — skipping all remaining summaries');
        dailyQuotaExhausted = true;
        return fallback(article);
      }

      if ((status === 429 || status === 503) && attempt < MAX_RETRIES) {
        const wait = status === 503 ? 10_000 : retryDelayMs(err);
        console.warn(`[summarizer] ${status} error — waiting ${Math.round(wait / 1000)}s (attempt ${attempt}/${MAX_RETRIES})`);
        await sleep(wait);
        continue;
      }

      console.warn(`[summarizer] fallback for "${article.title}":`, (err as any)?.message ?? err);
      return fallback(article);
    }
  }

  return fallback(article);
}

export async function summarizeAll(articles: Article[]): Promise<Article[]> {
  const result: Article[] = [];
  for (let i = 0; i < articles.length; i++) {
    const { title, summary } = await summarize(articles[i]);
    result.push({ ...articles[i], translatedTitle: title, summary });
    if (i < articles.length - 1 && !dailyQuotaExhausted) await sleep(DELAY_BETWEEN_MS);
  }
  return result;
}
