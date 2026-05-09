import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../../types';
import { LLMProvider, SummaryResult } from '../types';
import { withRetry } from '../../lib/retry';
import aiStyle from '../../../config/ai-style.json';

const MAX_RETRIES = 3;

export class GeminiProvider implements LLMProvider {
  private dailyQuotaExhausted = false;

  async summarize(article: Article): Promise<SummaryResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || process.env.SKIP_SUMMARIZE === 'true' || this.dailyQuotaExhausted) {
      return this.fallback(article);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' });

    try {
      return await withRetry(
        () => model.generateContent(this.buildPrompt(article))
          .then((r: { response: { text: () => string } }) => this.parseResult(r.response.text().trim(), article)),
        {
          maxAttempts: MAX_RETRIES,
          delayMs: 60_000,
          shouldRetry: (err) => {
            const status = (err as any)?.status;
            if (status === 429 && this.isDaily429(err)) {
              console.warn('[summarizer] daily quota exhausted — skipping all remaining summaries');
              this.dailyQuotaExhausted = true;
              return false;
            }
            return status === 429 || status === 503;
          },
          onRetry: (err, attempt) => {
            const status = (err as any)?.status;
            const wait = status === 503 ? 10_000 : this.retryDelayMs(err);
            console.warn(`[summarizer] ${status} error — waiting ${Math.round(wait / 1000)}s (attempt ${attempt}/${MAX_RETRIES})`);
          },
        }
      );
    } catch (err) {
      if (this.dailyQuotaExhausted) return this.fallback(article);
      console.warn(`[summarizer] fallback for "${article.title}":`, (err as any)?.message ?? err);
      return this.fallback(article);
    }
  }

  private buildPrompt(article: Article): string {
    return (
      `Você é um assistente que resume artigos de tecnologia em tom ${aiStyle.tone}, em ${aiStyle.language}.\n` +
      `Responda APENAS com um JSON válido, sem markdown, sem explicações:\n` +
      `{"title": "<título traduzido para português>", "summary": "<resumo em exatamente 2 linhas>"}\n\n` +
      `Título original: ${article.title}\nURL: ${article.url}`
    );
  }

  private parseResult(text: string, article: Article): SummaryResult {
    try {
      const json = text.match(/\{[\s\S]*\}/)?.[0];
      if (json) {
        const parsed = JSON.parse(json);
        if (parsed.title && parsed.summary) return parsed;
      }
    } catch { /* fallback below */ }
    return { title: article.title, summary: text.trim() };
  }

  private fallback(article: Article): SummaryResult {
    return {
      title: article.title,
      summary: 'Resumo indisponível no momento. Clique para ler o artigo completo.',
    };
  }

  private isDaily429(err: unknown): boolean {
    const violations: any[] = (err as any)?.errorDetails?.find(
      (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure'
    )?.violations ?? [];
    return violations.some((v) => String(v.quotaId ?? '').includes('PerDay'));
  }

  private retryDelayMs(err: unknown): number {
    const detail = (err as any)?.errorDetails?.find(
      (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
    );
    if (!detail?.retryDelay) return 60_000;
    const seconds = parseFloat(detail.retryDelay);
    return isNaN(seconds) ? 60_000 : seconds * 1000 + 1000;
  }
}
