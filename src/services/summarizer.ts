import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../types';
import aiStyle from '../../config/ai-style.json';

const DELAY_BETWEEN_MS = 5000; // 5s between calls → stays under 15 RPM free tier limit
const MAX_RETRIES = 3;

function buildPrompt(article: Article): string {
  return (
    `Você é um assistente que resume artigos de tecnologia em tom ${aiStyle.tone}, em ${aiStyle.language}.\n` +
    `Resuma o artigo abaixo em no máximo ${aiStyle.maxLines} linhas, sem preâmbulo:\n\n` +
    `Título: ${article.title}\nURL: ${article.url}`
  );
}

function fallback(article: Article): string {
  return article.title.slice(0, 300);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelayMs(err: unknown): number | null {
  const detail = (err as any)?.errorDetails?.find(
    (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
  );
  if (!detail?.retryDelay) return null;
  // retryDelay is e.g. "37s"
  const seconds = parseFloat(detail.retryDelay);
  return isNaN(seconds) ? null : seconds * 1000 + 1000;
}

export async function summarize(article: Article): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback(article);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(buildPrompt(article));
      return result.response.text().trim();
    } catch (err) {
      const status = (err as any)?.status;
      if (status === 429 && attempt < MAX_RETRIES) {
        const wait = retryDelayMs(err) ?? 60_000;
        console.warn(`[summarizer] rate limited — waiting ${Math.round(wait / 1000)}s before retry`);
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
    if (i < articles.length - 1) await sleep(DELAY_BETWEEN_MS);
  }
  return result;
}
