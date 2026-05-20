import { Article } from '../../types';
import aiStyle from '../../../config/ai-style.json';

export function buildPrompt(article: Article): string {
  return (
    `Resuma o artigo abaixo em ${aiStyle.language}, tom ${aiStyle.tone}.\n` +
    `Responda SOMENTE com este JSON, sem mais nada:\n` +
    `{"title": "<título em português>", "summary": "<2 frases resumindo o artigo>"}\n\n` +
    `Título: ${article.title}\nURL: ${article.url}`
  );
}
