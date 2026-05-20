import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../../types';
import { LLMProvider, SummaryResult } from '../types';
import { withRetry } from '../../lib/retry';
import { warn } from '../../lib/logger';
import aiStyle from '../../../config/ai-style.json';

const MAX_RETRIES = 3;

type GenerativeModel = ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

export class GeminiProvider implements LLMProvider {
  private dailyQuotaExhausted = false;
  private _model: GenerativeModel | null = null;

  private getModel(): GenerativeModel | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!this._model) {
      this._model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemma-4-31b-it' });
    }
    return this._model;
  }

  async summarize(article: Article): Promise<SummaryResult> {
    const model = this.getModel();
    if (!model || process.env.SKIP_SUMMARIZE === 'true' || this.dailyQuotaExhausted) {
      return this.fallback(article);
    }

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
              warn('summarizer', 'daily quota exhausted — skipping all remaining summaries');
              this.dailyQuotaExhausted = true;
              return false;
            }
            return status === 429 || status === 503;
          },
          onRetry: (err, attempt) => {
            const status = (err as any)?.status;
            const wait = status === 503 ? 10_000 : this.retryDelayMs(err);
            warn('summarizer', `${status} error — waiting ${Math.round(wait / 1000)}s (attempt ${attempt}/${MAX_RETRIES})`);
            return wait;
          },
        }
      );
    } catch (err) {
      if (this.dailyQuotaExhausted) return this.fallback(article);
      warn('summarizer', `fallback for "${article.title}": ${(err as any)?.message ?? err}`);
      return this.fallback(article);
    }
  }

  private buildPrompt(article: Article): string {
    return (
      `Resuma o artigo abaixo em ${aiStyle.language}, tom ${aiStyle.tone}.\n` +
      `Responda SOMENTE com este JSON, sem mais nada:\n` +
      `{"title": "<título em português>", "summary": "<2 frases resumindo o artigo>"}\n\n` +
      `Título: ${article.title}\nURL: ${article.url}`
    );
  }

  private parseResult(text: string, article: Article): SummaryResult {
    const matches = [...text.matchAll(/\{[^{}]*\}/g)];
    for (let i = matches.length - 1; i >= 0; i--) {
      try {
        const parsed = JSON.parse(matches[i][0]);
        if (parsed.title && parsed.summary) return parsed;
      } catch { continue; }
    }
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
