import axios from 'axios';
import { fetchArticles } from './hackernews';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const aiStory = {
  id: 1,
  title: 'New LLM beats GPT-4',
  url: 'https://example.com/llm',
  score: 200,
  descendants: 50,
  time: 1704067200,
};

const nonAiStory = {
  id: 2,
  title: 'Rust is amazing',
  url: 'https://example.com/rust',
  score: 150,
  descendants: 30,
  time: 1704067200,
};

describe('hackernews adapter', () => {
  afterEach(() => jest.clearAllMocks());

  it('filters to AI stories only', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: [1, 2] })
      .mockResolvedValueOnce({ data: aiStory })
      .mockResolvedValueOnce({ data: nonAiStory });

    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0].id).toBe('hn-1');
    expect(articles[0].source).toBe('HackerNews');
    expect(articles[0].views).toBe(200);
    expect(articles[0].comments).toBe(50);
  });

  it('skips stories without a url', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: [1] })
      .mockResolvedValueOnce({ data: { ...aiStory, url: undefined } });

    const articles = await fetchArticles();
    expect(articles).toHaveLength(0);
  });

  it('returns [] when top stories request fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network'));
    const articles = await fetchArticles();
    expect(articles).toEqual([]);
  });

  it('skips individual story fetch failures', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: [1, 2] })
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce({ data: aiStory });

    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
  });
});
