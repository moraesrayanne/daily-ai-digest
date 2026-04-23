import { Article } from '../types';

export function deduplicate(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}

export function deduplicateWithHistory(articles: Article[], seen: string[]): Article[] {
  const seenSet = new Set(seen);
  return articles.filter((a) => {
    if (seenSet.has(a.url)) return false;
    seenSet.add(a.url);
    return true;
  });
}
