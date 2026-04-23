import axios from 'axios';
import { fetchArticles } from './arxiv';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>http://arxiv.org/abs/2401.00001v1</id>
    <title>  Advances in Large Language Models  </title>
    <published>2024-01-01T00:00:00Z</published>
    <link rel="alternate" href="https://arxiv.org/abs/2401.00001"/>
  </entry>
</feed>`;

describe('arxiv adapter', () => {
  afterEach(() => jest.clearAllMocks());

  it('parses XML and maps to Article[]', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockXml });
    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Advances in Large Language Models');
    expect(articles[0].source).toBe('ArXiv');
    expect(articles[0].url).toBe('https://arxiv.org/abs/2401.00001');
    expect(articles[0].views).toBe(0);
    expect(articles[0].comments).toBe(0);
    expect(articles[0].publishedAt).toBeInstanceOf(Date);
  });

  it('returns [] on HTTP error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network'));
    const articles = await fetchArticles();
    expect(articles).toEqual([]);
  });

  it('returns [] when feed has no entries', async () => {
    mockedAxios.get.mockResolvedValue({
      data: `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"></feed>`,
    });
    const articles = await fetchArticles();
    expect(articles).toEqual([]);
  });
});
