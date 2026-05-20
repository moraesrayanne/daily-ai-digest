import { RankedArticle, SummarizedArticle } from '../types';
import { getLLMProvider } from '../llm/factory';
import { log } from '../lib/logger';

export async function summarizeAll(articles: RankedArticle[]): Promise<SummarizedArticle[]> {
  const provider = getLLMProvider();
  const result: SummarizedArticle[] = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    log('summarize', `[${i + 1}/${articles.length}] "${article.title}"`);
    const { title, summary } = await provider.summarize(article);
    log('summarize', `[${i + 1}/${articles.length}] done`);
    result.push({ ...article, translatedTitle: title, summary });
  }

  return result;
}
