import axios from 'axios';
import { fetchArticles } from './anthropic';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const makeHtml = (links: { path: string; title: string }[]) =>
  links.map(({ path, title }) => `<a href="${path}"><h2>${title}</h2></a>`).join('\n');

describe('anthropic adapter', () => {
  afterEach(() => jest.clearAllMocks());

  it('extracts articles from h2 titles', async () => {
    const html = makeHtml([
      { path: '/news/claude-3-announcement', title: 'Claude 3 is now available to everyone' },
      { path: '/news/constitutional-ai', title: 'Constitutional AI: A New Approach to Safety' },
    ]);
    mockedAxios.get.mockResolvedValue({ data: html });

    const articles = await fetchArticles();
    expect(articles).toHaveLength(2);
    expect(articles[0].title).toBe('Claude 3 is now available to everyone');
    expect(articles[0].url).toBe('https://www.anthropic.com/news/claude-3-announcement');
    expect(articles[0].source).toBe('Anthropic');
  });

  it('decodes HTML entities in titles', async () => {
    const html = makeHtml([{ path: '/news/ai-safety', title: 'AI &amp; Safety: What&#39;s Next' }]);
    mockedAxios.get.mockResolvedValue({ data: html });

    const articles = await fetchArticles();
    expect(articles[0].title).toBe("AI & Safety: What's Next");
  });

  it('skips links without a valid title', async () => {
    const html = `<a href="/news/short">hi</a>`;
    mockedAxios.get.mockResolvedValue({ data: html });

    const articles = await fetchArticles();
    expect(articles).toHaveLength(0);
  });

  it('deduplicates the same URL appearing multiple times', async () => {
    const html = `
      <a href="/news/claude-update"><h2>Claude Update: Major improvements coming soon</h2></a>
      <a href="/news/claude-update"><h2>Claude Update: Major improvements coming soon</h2></a>
    `;
    mockedAxios.get.mockResolvedValue({ data: html });

    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
  });

  it('returns [] on network error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network'));
    const articles = await fetchArticles();
    expect(articles).toEqual([]);
  });
});
