import { deduplicate, deduplicateWithHistory } from './deduplicator';
import { Article } from '../types';

const makeArticle = (id: string, url: string): Article => ({
  id,
  title: `Title ${id}`,
  url,
  source: 'Test',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
});

describe('deduplicate', () => {
  it('removes duplicate URLs, keeping first occurrence', () => {
    const articles = [
      makeArticle('1', 'https://a.com'),
      makeArticle('2', 'https://b.com'),
      makeArticle('3', 'https://a.com'),
    ];
    const result = deduplicate(articles);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('returns all articles when no duplicates', () => {
    const articles = [
      makeArticle('1', 'https://a.com'),
      makeArticle('2', 'https://b.com'),
    ];
    expect(deduplicate(articles)).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(deduplicate([])).toEqual([]);
  });
});

describe('deduplicateWithHistory', () => {
  it('filters out URLs present in history', () => {
    const articles = [
      makeArticle('1', 'https://a.com'),
      makeArticle('2', 'https://b.com'),
    ];
    const result = deduplicateWithHistory(articles, ['https://a.com']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('also deduplicates within the batch', () => {
    const articles = [
      makeArticle('1', 'https://c.com'),
      makeArticle('2', 'https://c.com'),
    ];
    const result = deduplicateWithHistory(articles, []);
    expect(result).toHaveLength(1);
  });

  it('returns all when history is empty and no duplicates', () => {
    const articles = [makeArticle('1', 'https://a.com')];
    expect(deduplicateWithHistory(articles, [])).toHaveLength(1);
  });
});
