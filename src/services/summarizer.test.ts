import { summarize, summarizeAll } from './summarizer';
import { Article } from '../types';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Resumo gerado pelo Gemini.' },
      }),
    }),
  })),
}));

const makeArticle = (id: string): Article => ({
  id,
  title: `Article about LLM number ${id}`,
  url: `https://example.com/${id}`,
  source: 'Test',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
});

describe('summarize', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, GEMINI_API_KEY: 'test-key' };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  it('returns Gemini summary when API key is set', async () => {
    const result = await summarize(makeArticle('1'));
    expect(result).toBe('Resumo gerado pelo Gemini.');
  });

  it('falls back to title slice when no API key', async () => {
    delete process.env.GEMINI_API_KEY;
    const article = makeArticle('2');
    const result = await summarize(article);
    expect(result).toBe(article.title.slice(0, 300));
  });

  it('falls back to title slice when Gemini throws', async () => {
    const { GoogleGenerativeAI } = jest.requireMock('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockRejectedValue(new Error('API error')),
      }),
    }));
    const article = makeArticle('3');
    const result = await summarize(article);
    expect(result).toBe(article.title.slice(0, 300));
  });
});

describe('summarizeAll', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    jest.clearAllMocks();
  });

  it('runs sequentially and attaches summary to each article', async () => {
    const articles = [makeArticle('1'), makeArticle('2')];
    const result = await summarizeAll(articles);
    expect(result).toHaveLength(2);
    result.forEach((a) => expect(a.summary).toBe('Resumo gerado pelo Gemini.'));
  });

  it('returns empty array for empty input', async () => {
    expect(await summarizeAll([])).toEqual([]);
  });
});
