import { getSentUrls, saveDigest, _resetClientForTest } from './supabase';
import { Article } from '../types';

const mockSelect = jest.fn();
const mockGte = jest.fn();
const mockUpsert = jest.fn();
const mockSingle = jest.fn();

const mockFrom = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ from: mockFrom })),
}));

const makeArticle = (id: string): Article => ({
  id,
  title: `Article ${id}`,
  url: `https://example.com/${id}`,
  source: 'DevTo',
  publishedAt: new Date('2024-01-01T10:00:00Z'),
  views: 0,
  comments: 0,
  summary: 'Summary',
  score: 0.8,
});

describe('getSentUrls', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://fake.supabase.co';
    process.env.SUPABASE_KEY = 'fake-key';
  });

  afterEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_KEY;
    _resetClientForTest();
    jest.clearAllMocks();
  });

  it('returns list of URLs from articles table', async () => {
    mockGte.mockResolvedValueOnce({ data: [{ url: 'https://a.com' }, { url: 'https://b.com' }], error: null });
    mockSelect.mockReturnValue({ gte: mockGte });
    mockFrom.mockReturnValue({ select: mockSelect });

    const urls = await getSentUrls();
    expect(urls).toEqual(['https://a.com', 'https://b.com']);
  });

  it('returns empty array when no data', async () => {
    mockGte.mockResolvedValueOnce({ data: null, error: null });
    mockSelect.mockReturnValue({ gte: mockGte });
    mockFrom.mockReturnValue({ select: mockSelect });

    const urls = await getSentUrls();
    expect(urls).toEqual([]);
  });

  it('throws when supabase returns an error', async () => {
    mockGte.mockResolvedValueOnce({ data: null, error: new Error('DB error') });
    mockSelect.mockReturnValue({ gte: mockGte });
    mockFrom.mockReturnValue({ select: mockSelect });

    await expect(getSentUrls()).rejects.toThrow('DB error');
  });

  it('throws when SUPABASE_URL is missing', async () => {
    delete process.env.SUPABASE_URL;
    await expect(getSentUrls()).rejects.toThrow('SUPABASE_URL');
  });
});

describe('saveDigest', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://fake.supabase.co';
    process.env.SUPABASE_KEY = 'fake-key';
  });

  afterEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_KEY;
    _resetClientForTest();
    jest.clearAllMocks();
  });

  it('upserts articles, digest, and join rows without error', async () => {
    const articleUpsertChain = {
      select: jest.fn().mockResolvedValue({
        data: [{ id: 'uuid-1', url: 'https://example.com/1' }],
        error: null,
      }),
    };
    const digestUpsertChain = {
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: { id: 'digest-uuid' }, error: null }),
      }),
    };
    const joinUpsertResult = Promise.resolve({ error: null });

    mockUpsert
      .mockReturnValueOnce(articleUpsertChain)
      .mockReturnValueOnce(digestUpsertChain)
      .mockReturnValueOnce(joinUpsertResult);

    mockFrom.mockReturnValue({ upsert: mockUpsert });

    await expect(saveDigest([makeArticle('1')])).resolves.toBeUndefined();
    expect(mockUpsert).toHaveBeenCalledTimes(3);
  });

  it('throws when article upsert fails', async () => {
    const articleUpsertChain = {
      select: jest.fn().mockResolvedValue({ data: null, error: new Error('article error') }),
    };
    mockUpsert.mockReturnValueOnce(articleUpsertChain);
    mockFrom.mockReturnValue({ upsert: mockUpsert });

    await expect(saveDigest([makeArticle('1')])).rejects.toThrow('article error');
  });
});
