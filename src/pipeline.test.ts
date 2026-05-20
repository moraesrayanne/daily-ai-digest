import { runPipeline } from './pipeline';
import { Article, RankedArticle, SummarizedArticle } from './types';

jest.mock('./services/aggregator');
jest.mock('./services/deduplicator');
jest.mock('./services/ranker');
jest.mock('./services/summarizer');
jest.mock('./services/supabase');
jest.mock('./lib/logger');

import { aggregate } from './services/aggregator';
import { deduplicate, deduplicateWithHistory } from './services/deduplicator';
import { rank } from './services/ranker';
import { summarizeAll } from './services/summarizer';
import { getSentUrls, saveDigest } from './services/supabase';
import { warn } from './lib/logger';

const makeArticle = (i: number): Article => ({
  id: `a${i}`,
  title: `Article ${i}`,
  url: `https://example.com/${i}`,
  source: 'DevTo',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
});

const makeRanked = (i: number): RankedArticle => ({ ...makeArticle(i), score: 0.5 });
const makeSummarized = (i: number): SummarizedArticle => ({
  ...makeRanked(i),
  summary: 'summary',
  translatedTitle: `Artigo ${i}`,
});

const articles = Array.from({ length: 10 }, (_, i) => makeArticle(i));
const ranked = articles.map((_, i) => makeRanked(i));
const summarized = articles.map((_, i) => makeSummarized(i));

describe('runPipeline', () => {
  beforeEach(() => {
    (aggregate as jest.Mock).mockResolvedValue(articles);
    (getSentUrls as jest.Mock).mockResolvedValue([]);
    (deduplicate as jest.Mock).mockReturnValue(articles);
    (deduplicateWithHistory as jest.Mock).mockReturnValue(articles);
    (rank as jest.Mock).mockReturnValue(ranked);
    (summarizeAll as jest.Mock).mockResolvedValue(summarized);
    (saveDigest as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => jest.clearAllMocks());

  it('calls services in order and completes without error', async () => {
    await expect(runPipeline()).resolves.toBeUndefined();
    expect(aggregate).toHaveBeenCalled();
    expect(getSentUrls).toHaveBeenCalled();
    expect(deduplicate).toHaveBeenCalled();
    expect(deduplicateWithHistory).toHaveBeenCalled();
    expect(rank).toHaveBeenCalled();
    expect(summarizeAll).toHaveBeenCalled();
    expect(saveDigest).toHaveBeenCalledWith(summarized);
  });

  it('throws when no articles remain after dedup', async () => {
    (deduplicateWithHistory as jest.Mock).mockReturnValue([]);
    await expect(runPipeline()).rejects.toThrow('no articles to send after deduplication');
  });

  it('warns when fewer than 10 articles remain', async () => {
    const few = articles.slice(0, 5);
    (deduplicateWithHistory as jest.Mock).mockReturnValue(few);
    (rank as jest.Mock).mockReturnValue(few.map((_, i) => makeRanked(i)));
    (summarizeAll as jest.Mock).mockResolvedValue(few.map((_, i) => makeSummarized(i)));
    await runPipeline();
    expect(warn).toHaveBeenCalledWith('deduplicate', expect.stringContaining('5'));
  });
});
