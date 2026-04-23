import axios from 'axios';
import { Article } from '../types';

const BASE_URL = 'https://www.anthropic.com';
const NEWS_URL = `${BASE_URL}/news`;

export async function fetchArticles(): Promise<Article[]> {
  try {
    const { data: html } = await axios.get<string>(NEWS_URL, {
      timeout: 10_000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Daily-AI-Digest/1.0)',
        'Accept': 'text/html',
      },
    });

    const articles: Article[] = [];

    // Match article links: href="/news/slug" — Anthropic uses Next.js with this pattern
    const linkPattern = /href="(\/news\/[a-z0-9][a-z0-9-]+)"/g;
    const seenUrls = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(html)) !== null) {
      const path = match[1];
      const url = `${BASE_URL}${path}`;
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);

      // Extract title: look for text content near this link
      // Anthropic wraps titles in <h3> or <div> close to the href
      const linkIndex = match.index;
      const surrounding = html.slice(Math.max(0, linkIndex - 800), linkIndex + 800);

      const titleMatch =
        surrounding.match(/<h[1-6][^>]*>([^<]{10,200})<\/h[1-6]>/) ??
        surrounding.match(/aria-label="([^"]{10,200})"/) ??
        surrounding.match(/<p[^>]*class="[^"]*title[^"]*"[^>]*>([^<]{10,200})<\/p>/) ??
        surrounding.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]{10,200})<\/div>/) ??
        surrounding.match(/<span[^>]*class="[^"]*heading[^"]*"[^>]*>([^<]{10,200})<\/span>/);

      const rawTitle = titleMatch?.[1]?.trim() ?? '';
      const title = rawTitle.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();

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
  } catch (err) {
    console.warn('[anthropic] failed to fetch news:', (err as any)?.message ?? err);
    return [];
  }
}
