import { Article } from '../../types';
import { SummaryResult } from '../types';

export function parseResponse(text: string, article: Article): SummaryResult {
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

export function fallbackResult(article: Article): SummaryResult {
  return {
    title: article.title,
    summary: 'Resumo indisponível no momento. Clique para ler o artigo completo.',
  };
}
