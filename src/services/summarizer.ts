import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../types';
import aiStyle from '../../config/ai-style.json';

const DELAY_BETWEEN_MS = 5000;
const MAX_RETRIES = 3;

let dailyQuotaExhausted = false;

function buildPrompt(article: Article): string {
  return (
    `Você é um assistente que resume artigos de tecnologia em tom ${aiStyle.tone}, em ${aiStyle.language}.\n` +
    `Escreva exatamente 2 linhas resumindo o artigo abaixo. Sem preâmbulo, sem bullet points:\n\n` +
    `Título: ${article.title}\nURL: ${article.url}`
  );
}

function fallback(_article: Article): string {
  return 'Resumo indisponível no momento. Clique para ler o artigo completo.';
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

export async function summarize(article: Article): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || process.env.SKIP_SUMMARIZE === 'true' || dailyQuotaExhausted) {
    return fallback(article);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(buildPrompt(article));
      return result.response.text().trim();
    } catch (err) {
      const status = (err as any)?.status;

      if (status === 429 && isDaily429(err)) {
        console.warn('[summarizer] daily quota exhausted — skipping all remaining summaries');
        dailyQuotaExhausted = true;
        return fallback(article);
      }

      if (status === 429 && attempt < MAX_RETRIES) {
        const wait = retryDelayMs(err);
        console.warn(`[summarizer] rate limited — waiting ${Math.round(wait / 1000)}s (attempt ${attempt}/${MAX_RETRIES})`);
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
    const summary = await summarize(articles[i]);
    result.push({ ...articles[i], summary });
    if (i < articles.length - 1 && !dailyQuotaExhausted) await sleep(DELAY_BETWEEN_MS);
  }
  return result;
}
