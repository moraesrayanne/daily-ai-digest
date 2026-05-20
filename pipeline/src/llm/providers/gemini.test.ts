import { GeminiProvider } from './gemini';
import { Article } from '../../types';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => '{"title":"Título PT","summary":"Resumo gerado pelo Gemini."}' },
      }),
    }),
  })),
}));

const makeArticle = (id: string): Article => ({
  id,
  title: `Article ${id}`,
  url: `https://example.com/${id}`,
  source: 'Test',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
});

describe('GeminiProvider', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, GEMINI_API_KEY: 'test-key' };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  it('returns parsed SummaryResult on success', async () => {
    const provider = new GeminiProvider();
    const result = await provider.summarize(makeArticle('1'));
    expect(result).toEqual({ title: 'Título PT', summary: 'Resumo gerado pelo Gemini.' });
  });

  it('falls back when no API key', async () => {
    delete process.env.GEMINI_API_KEY;
    const provider = new GeminiProvider();
    const result = await provider.summarize(makeArticle('2'));
    expect(result.summary).toContain('Resumo indisponível');
    expect(result.title).toBe('Article 2');
  });

  it('falls back when SKIP_SUMMARIZE=true', async () => {
    process.env.SKIP_SUMMARIZE = 'true';
    const provider = new GeminiProvider();
    const result = await provider.summarize(makeArticle('3'));
    expect(result.summary).toContain('Resumo indisponível');
    delete process.env.SKIP_SUMMARIZE;
  });

  it('falls back when Gemini throws a non-retryable error', async () => {
    const { GoogleGenerativeAI } = jest.requireMock('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockRejectedValue(new Error('API error')),
      }),
    }));
    const provider = new GeminiProvider();
    const result = await provider.summarize(makeArticle('4'));
    expect(result.summary).toContain('Resumo indisponível');
  });

  it('returns original title in fallback', async () => {
    delete process.env.GEMINI_API_KEY;
    const provider = new GeminiProvider();
    const result = await provider.summarize(makeArticle('5'));
    expect(result.title).toBe('Article 5');
  });

  it('handles invalid JSON response with text fallback', async () => {
    const { GoogleGenerativeAI } = jest.requireMock('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => 'Not valid JSON at all' },
        }),
      }),
    }));
    const provider = new GeminiProvider();
    const result = await provider.summarize(makeArticle('6'));
    expect(result.summary).toBe('Not valid JSON at all');
  });
});
