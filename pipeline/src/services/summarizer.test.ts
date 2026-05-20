import { summarizeAll } from './summarizer';
import { getLLMProvider, _resetProviderForTest } from '../llm/factory';
import { RankedArticle } from '../types';

jest.mock('../llm/factory');

const mockSummarize = jest.fn();

const makeArticle = (id: string): RankedArticle => ({
  id,
  title: `Article about LLM number ${id}`,
  url: `https://example.com/${id}`,
  source: 'Test',
  publishedAt: new Date(),
  views: 0,
  comments: 0,
  score: 0.5,
});

beforeEach(() => {
  (getLLMProvider as jest.Mock).mockReturnValue({ summarize: mockSummarize });
  mockSummarize.mockResolvedValue({ title: 'Título PT', summary: 'Resumo gerado pelo Gemini.' });
});

afterEach(() => {
  jest.clearAllMocks();
  _resetProviderForTest();
});

describe('summarizeAll', () => {
  it('attaches title + summary to each article', async () => {
    const articles = [makeArticle('1'), makeArticle('2')];
    const result = await summarizeAll(articles);
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
