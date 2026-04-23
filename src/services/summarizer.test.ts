import { summarize, summarizeAll } from './summarizer';
import { getLLMProvider, _resetProviderForTest } from '../llm/factory';
import { Article } from '../types';

jest.mock('../llm/factory');

const mockSummarize = jest.fn();

const makeArticle = (id: string): Article => ({
  id,
  title: `Article about LLM number ${id}`,
  url: `https://example.com/${id}`,
  source: 'Test',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
});

beforeEach(() => {
  (getLLMProvider as jest.Mock).mockReturnValue({ summarize: mockSummarize });
  mockSummarize.mockResolvedValue({ title: 'Título PT', summary: 'Resumo gerado pelo Gemini.' });
});

afterEach(() => {
  jest.clearAllMocks();
  _resetProviderForTest();
});

describe('summarize', () => {
  it('returns summary string from provider', async () => {
    const result = await summarize(makeArticle('1'));
    expect(result).toBe('Resumo gerado pelo Gemini.');
  });

  it('propagates provider error', async () => {
    mockSummarize.mockRejectedValueOnce(new Error('API error'));
    await expect(summarize(makeArticle('2'))).rejects.toThrow('API error');
  });
});

describe('summarizeAll', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('runs sequentially and attaches title + summary to each article', async () => {
    const articles = [makeArticle('1'), makeArticle('2')];
    const promise = summarizeAll(articles);
    await jest.runAllTimersAsync();
    const result = await promise;
    expect(result).toHaveLength(2);
    result.forEach((a) => {
      expect(a.summary).toBe('Resumo gerado pelo Gemini.');
      expect(a.translatedTitle).toBe('Título PT');
    });
  });

  it('returns empty array for empty input', async () => {
    expect(await summarizeAll([])).toEqual([]);
  });
});
