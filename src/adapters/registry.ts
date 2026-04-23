import { Article } from '../types';
import { fetchArticles as fetchDevTo } from './devto';
import { fetchArticles as fetchHackerNews } from './hackernews';
import { fetchArticles as fetchArXiv } from './arxiv';
import { fetchArticles as fetchRSS } from './rss';
import { fetchArticles as fetchAnthropic } from './anthropic';

export type AdapterFn = () => Promise<Article[]>;

const registry: Record<string, AdapterFn> = {
  devto:      fetchDevTo,
  hackernews: fetchHackerNews,
  arxiv:      fetchArXiv,
  rss:        fetchRSS,
  anthropic:  fetchAnthropic,
};

export function getAdapter(name: string): AdapterFn | undefined {
  return registry[name];
}

export function registerAdapter(name: string, fn: AdapterFn): void {
  registry[name] = fn;
}
