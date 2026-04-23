import { Article } from '../types';
import { getLLMProvider } from '../llm/factory';

export { SummaryResult } from '../llm/types';

const DELAY_BETWEEN_MS = 5000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function summarize(article: Article): Promise<string> {
  const { summary } = await getLLMProvider().summarize(article);
  return summary;
}

export async function summarizeAll(articles: Article[]): Promise<Article[]> {
  const provider = getLLMProvider();
  const result: Article[] = [];

  for (let i = 0; i < articles.length; i++) {
    const { title, summary } = await provider.summarize(articles[i]);
    result.push({ ...articles[i], translatedTitle: title, summary });
    if (i < articles.length - 1) await sleep(DELAY_BETWEEN_MS);
  }

  return result;
}
