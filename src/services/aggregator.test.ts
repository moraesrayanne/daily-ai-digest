import { aggregate } from './aggregator';
import * as devto from '../adapters/devto';
import * as hackernews from '../adapters/hackernews';
import * as arxiv from '../adapters/arxiv';
import { Article } from '../types';

jest.mock('../adapters/devto');
jest.mock('../adapters/hackernews');
jest.mock('../adapters/arxiv');

const makeArticle = (id: string): Article => ({
  id,
  title: `Article ${id}`,
  url: `https://example.com/${id}`,
  source: 'Test',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
});

describe('aggregator', () => {
  afterEach(() => jest.clearAllMocks());

  it('runs all enabled adapters in parallel and merges results', async () => {
    (devto.fetchArticles as jest.Mock).mockResolvedValue([makeArticle('d1')]);
    (hackernews.fetchArticles as jest.Mock).mockResolvedValue([makeArticle('h1')]);
    (arxiv.fetchArticles as jest.Mock).mockResolvedValue([makeArticle('a1')]);

    const articles = await aggregate();
    expect(articles).toHaveLength(3);
    expect(articles.map((a) => a.id)).toEqual(
      expect.arrayContaining(['d1', 'h1', 'a1'])
    );
  });

  it('returns flat array (no nested arrays)', async () => {
    (devto.fetchArticles as jest.Mock).mockResolvedValue([makeArticle('d1'), makeArticle('d2')]);
    (hackernews.fetchArticles as jest.Mock).mockResolvedValue([]);
    (arxiv.fetchArticles as jest.Mock).mockResolvedValue([makeArticle('a1')]);

    const articles = await aggregate();
    expect(Array.isArray(articles)).toBe(true);
    articles.forEach((a) => expect(typeof a).toBe('object'));
    expect(articles).toHaveLength(3);
  });
});
