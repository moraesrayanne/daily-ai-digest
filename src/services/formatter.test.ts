import { format } from './formatter';
import { Article } from '../types';

const makeArticle = (id: string): Article => ({
  id,
  title: `Article ${id}`,
  url: `https://example.com/${id}`,
  source: 'DevTo',
  publishedAt: new Date('2024-01-01T10:00:00Z'),
  views: 0,
  comments: 0,
  summary: `Summary ${id}`,
});

describe('format', () => {
  const fixedDate = new Date('2024-03-15T08:00:00Z');

  it('produces correct subject with dd/mm/yyyy format', () => {
    const { subject } = format([], fixedDate);
    expect(subject).toBe('🤖 Daily AI Digest — 15/03/2024');
  });

  it('returns html and text fields', () => {
    const { html, text } = format([makeArticle('1')], fixedDate);
    expect(html).toContain('Article 1');
    expect(text).toContain('Article 1');
  });

  it('html includes the formatted date', () => {
    const { html } = format([], fixedDate);
    expect(html).toContain('15/03/2024');
  });

  it('text includes article source, title, and URL', () => {
    const { text } = format([makeArticle('5')], fixedDate);
    expect(text).toContain('[DevTo]');
    expect(text).toContain('Article 5');
    expect(text).toContain('https://example.com/5');
  });

  it('defaults to current date when no date passed', () => {
    const { subject } = format([]);
    expect(subject).toMatch(/🤖 Daily AI Digest — \d{2}\/\d{2}\/\d{4}/);
  });
});
