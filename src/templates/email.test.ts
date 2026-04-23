import { buildEmailHtml, buildEmailText } from './email';
import { Article } from '../types';

const makeArticle = (id: string, source = 'DevTo'): Article => ({
  id,
  title: `Article ${id}`,
  url: `https://example.com/${id}`,
  source,
  publishedAt: new Date('2024-01-01T10:00:00Z'),
  views: 0,
  comments: 0,
  summary: `Summary for article ${id}`,
});

describe('buildEmailHtml', () => {
  it('includes the date in the header', () => {
    const html = buildEmailHtml([], '01/01/2024');
    expect(html).toContain('01/01/2024');
  });

  it('renders one row per article', () => {
    const articles = [makeArticle('1'), makeArticle('2')];
    const html = buildEmailHtml(articles, '01/01/2024');
    expect(html).toContain('Article 1');
    expect(html).toContain('Article 2');
  });

  it('renders source label for HackerNews', () => {
    const html = buildEmailHtml([makeArticle('1', 'HackerNews')], '01/01/2024');
    expect(html).toContain('Hacker News');
  });

  it('includes article URL as link', () => {
    const html = buildEmailHtml([makeArticle('42')], '01/01/2024');
    expect(html).toContain('https://example.com/42');
  });

  it('renders empty list without crashing', () => {
    expect(() => buildEmailHtml([], '01/01/2024')).not.toThrow();
  });
});

describe('buildEmailText', () => {
  it('formats each article as numbered entry', () => {
    const articles = [makeArticle('1'), makeArticle('2')];
    const text = buildEmailText(articles);
    expect(text).toContain('1. [DevTo] Article 1');
    expect(text).toContain('2. [DevTo] Article 2');
  });

  it('includes summary and URL', () => {
    const text = buildEmailText([makeArticle('5')]);
    expect(text).toContain('Summary for article 5');
    expect(text).toContain('https://example.com/5');
  });

  it('handles missing summary gracefully', () => {
    const article: Article = { ...makeArticle('7'), summary: undefined };
    expect(() => buildEmailText([article])).not.toThrow();
  });
});
