import { rank } from './ranker';
import { Article } from '../types';

const now = new Date('2024-01-01T12:00:00Z');

const makeArticle = (overrides: Partial<Article> & { id: string }): Article => ({
  title: 'Default Title',
  url: `https://example.com/${overrides.id}`,
  source: 'Test',
  publishedAt: now,
  views: 0,
  comments: 0,
  ...overrides,
});

describe('rank', () => {
  it('returns empty array for empty input', () => {
    expect(rank([], now)).toEqual([]);
  });

  it('returns at most 10 articles', () => {
    const articles = Array.from({ length: 15 }, (_, i) =>
      makeArticle({ id: `${i}`, publishedAt: now })
    );
    expect(rank(articles, now)).toHaveLength(10);
  });

  it('stores score on each article', () => {
    const articles = [makeArticle({ id: '1' })];
    const result = rank(articles, now);
    expect(result[0].score).toBeDefined();
    expect(typeof result[0].score).toBe('number');
  });

  it('sorts by score descending', () => {
    const fresh = makeArticle({ id: 'fresh', publishedAt: now, views: 1000, title: 'LLM news' });
    const stale = makeArticle({
      id: 'stale',
      publishedAt: new Date(now.getTime() - 25 * 3600 * 1000),
      views: 0,
      title: 'Old article',
    });
    const result = rank([stale, fresh], now);
    expect(result[0].id).toBe('fresh');
  });

  it('gives recency 1.0 for articles <12h old', () => {
    const recent = makeArticle({ id: 'r', publishedAt: new Date(now.getTime() - 6 * 3600 * 1000), title: '' });
    const result = rank([recent], now);
    expect(result[0].score).toBeGreaterThan(0.25);
  });

  it('gives recency 0 for articles >24h old', () => {
    const old = makeArticle({ id: 'o', publishedAt: new Date(now.getTime() - 25 * 3600 * 1000), title: '' });
    const result = rank([old], now);
    expect(result[0].score).toBe(0);
  });

  it('applies relevance boost for LLM/GPT/neural keywords', () => {
    const boosted = makeArticle({ id: 'b', title: 'New LLM beats GPT', publishedAt: now });
    const plain = makeArticle({ id: 'p', title: 'Some article', publishedAt: now });
    const result = rank([plain, boosted], now);
    expect(result[0].id).toBe('b');
  });
});
