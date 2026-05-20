import axios from 'axios';
import { Article } from '../types';
import { withErrorBoundary } from '../lib/error-boundary';

const BASE_URL = 'https://www.anthropic.com';
const NEWS_URL = `${BASE_URL}/news`;

const HTML_ENTITIES: [RegExp, string][] = [
  [/&amp;/g, '&'],
  [/&#39;/g, "'"],
  [/&quot;/g, '"'],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
];

function decodeHtmlEntities(text: string): string {
  return HTML_ENTITIES.reduce((s, [pattern, replacement]) => s.replace(pattern, replacement), text);
}

export async function fetchArticles(): Promise<Article[]> {
  return withErrorBoundary('anthropic', async () => {
    const { data: html } = await axios.get<string>(NEWS_URL, {
      timeout: 10_000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Daily-AI-Digest/1.0)',
        'Accept': 'text/html',
      },
    });

    const articles: Article[] = [];
    const linkPattern = /href="(\/news\/[a-z0-9][a-z0-9-]+)"/g;
    const seenUrls = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(html)) !== null) {
      const path = match[1];
      const url = `${BASE_URL}${path}`;
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);

      const linkIndex = match.index;
      const surrounding = html.slice(Math.max(0, linkIndex - 800), linkIndex + 800);

      const titleMatch =
        surrounding.match(/<h[1-6][^>]*>([^<]{10,200})<\/h[1-6]>/) ??
        surrounding.match(/aria-label="([^"]{10,200})"/) ??
        surrounding.match(/<p[^>]*class="[^"]*title[^"]*"[^>]*>([^<]{10,200})<\/p>/) ??
        surrounding.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]{10,200})<\/div>/) ??
        surrounding.match(/<span[^>]*class="[^"]*heading[^"]*"[^>]*>([^<]{10,200})<\/span>/);

      const title = decodeHtmlEntities(titleMatch?.[1]?.trim() ?? '');
      if (!title || title.length < 10) continue;

      articles.push({
        id: `anthropic-${articles.length}-${Date.now()}`,
        title,
        url,
        source: 'Anthropic',
        publishedAt: new Date(),
        views: 0,
        comments: 0,
      });

      if (articles.length >= 10) break;
    }

    return articles;
  });
}
