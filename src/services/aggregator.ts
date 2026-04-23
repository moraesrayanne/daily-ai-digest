import { Article } from '../types';
import { fetchArticles as fetchDevTo } from '../adapters/devto';
import { fetchArticles as fetchHackerNews } from '../adapters/hackernews';
import { fetchArticles as fetchArXiv } from '../adapters/arxiv';
import { fetchArticles as fetchRSS } from '../adapters/rss';
import { fetchArticles as fetchAnthropic } from '../adapters/anthropic';
import sourcesConfig from '../../config/sources.json';

type AdapterName = 'devto' | 'hackernews' | 'arxiv' | 'rss' | 'anthropic';

const adapters: Record<AdapterName, () => Promise<Article[]>> = {
  devto: fetchDevTo,
  hackernews: fetchHackerNews,
  arxiv: fetchArXiv,
  rss: fetchRSS,
  anthropic: fetchAnthropic,
};

export async function aggregate(): Promise<Article[]> {
  const enabled = sourcesConfig.sources
    .filter((s) => s.enabled)
    .map((s) => s.name as AdapterName)
    .filter((name) => name in adapters);

  const results = await Promise.all(enabled.map((name) => adapters[name]()));
  return results.flat();
}
