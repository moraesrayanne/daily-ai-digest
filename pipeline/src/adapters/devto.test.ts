import axios from 'axios';
import { fetchArticles } from './devto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockItem = {
  id: 1,
  title: 'AI is great',
  url: 'https://dev.to/ai-is-great',
  published_at: '2024-01-01T00:00:00Z',
  page_views_count: 100,
  comments_count: 5,
};

describe('devto adapter', () => {
  afterEach(() => jest.clearAllMocks());

  it('maps API response to Article[]', async () => {
    mockedAxios.get.mockResolvedValue({ data: [mockItem] });
    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      id: 'devto-1',
      title: 'AI is great',
      url: 'https://dev.to/ai-is-great',
      source: 'DevTo',
      views: 100,
      comments: 5,
    });
    expect(articles[0].publishedAt).toBeInstanceOf(Date);
  });

  it('returns [] on HTTP error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network error'));
    const articles = await fetchArticles();
    expect(articles).toEqual([]);
  });

  it('defaults views and comments to 0 when missing', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [{ ...mockItem, page_views_count: undefined, comments_count: undefined }],
    });
    const articles = await fetchArticles();
    expect(articles[0].views).toBe(0);
    expect(articles[0].comments).toBe(0);
  });
});
