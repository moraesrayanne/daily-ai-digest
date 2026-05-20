import axios from 'axios';
import { fetchArticles } from './rss';

jest.mock('axios');
jest.mock('../../config/sources.json', () => ({
  rssFeeds: [
    { name: 'TestFeed', url: 'https://example.com/rss' },
  ],
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const RSS_XML = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>AI breakthrough announced today</title>
      <link>https://example.com/ai-breakthrough</link>
      <pubDate>Mon, 01 Jan 2024 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Machine learning in production systems</title>
      <link>https://example.com/ml-production</link>
      <pubDate>Mon, 01 Jan 2024 09:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const ATOM_XML = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Deep learning advances in 2024</title>
    <link href="https://example.com/deep-learning"/>
    <published>2024-01-01T10:00:00Z</published>
  </entry>
</feed>`;

describe('rss adapter', () => {
  afterEach(() => jest.clearAllMocks());

  it('parses RSS 2.0 feed and returns articles', async () => {
    mockedAxios.get.mockResolvedValue({ data: RSS_XML });
    const articles = await fetchArticles();
    expect(articles).toHaveLength(2);
    expect(articles[0].title).toBe('AI breakthrough announced today');
    expect(articles[0].url).toBe('https://example.com/ai-breakthrough');
    expect(articles[0].source).toBe('TestFeed');
    expect(articles[0].publishedAt).toBeInstanceOf(Date);
  });

  it('parses Atom feed and returns articles', async () => {
    mockedAxios.get.mockResolvedValue({ data: ATOM_XML });
    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Deep learning advances in 2024');
    expect(articles[0].url).toBe('https://example.com/deep-learning');
  });

  it('returns [] when feed fetch fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('timeout'));
    const articles = await fetchArticles();
    expect(articles).toEqual([]);
  });

  it('filters out items without title or url', async () => {
    const xml = `<?xml version="1.0"?>
<rss version="2.0"><channel>
  <item><title>Valid article with a proper title here</title><link>https://example.com/valid</link></item>
  <item><link>https://example.com/no-title</link></item>
  <item><title>No URL article title here please</title></item>
</channel></rss>`;
    mockedAxios.get.mockResolvedValue({ data: xml });
    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Valid article with a proper title here');
  });
});
