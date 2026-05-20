import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Article } from '../types';
import { withErrorBoundary } from '../lib/error-boundary';
import sourcesConfig from '../../config/sources.json';

interface RssFeed {
  name: string;
  url: string;
}

interface RssItem {
  title?: string[];
  link?: string[];
  pubDate?: string[];
  published?: string[];
  updated?: string[];
  'dc:date'?: string[];
  id?: string[];
}

function parseTitle(raw: unknown): string {
  if (!raw) return '';
  if (typeof raw === 'string') return raw.replace(/<[^>]+>/g, '').trim();
  if (typeof raw === 'object' && (raw as any)._)
    return String((raw as any)._)
      .replace(/<[^>]+>/g, '')
      .trim();
  return String(raw)
    .replace(/<[^>]+>/g, '')
    .trim();
}

function parseDate(item: RssItem): Date {
  const raw = item.pubDate?.[0] ?? item.published?.[0] ?? item.updated?.[0] ?? item['dc:date']?.[0];
  if (!raw) return new Date();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

function parseLink(item: RssItem): string {
  const link = item.link?.[0];
  if (!link) return '';
  if (typeof link === 'object' && (link as any)?.$?.href) {
    return (link as any).$.href;
  }
  return String(link).trim();
}

async function fetchFeed(feed: RssFeed, index: number): Promise<Article[]> {
  return withErrorBoundary(`rss:${feed.name}`, async () => {
    const { data: xml } = await axios.get<string>(feed.url, {
      timeout: 10_000,
      headers: { 'User-Agent': 'Daily-AI-Digest/1.0' },
    });

    const parsed = await parseStringPromise(xml, { explicitArray: true });

    const rssItems: RssItem[] = parsed?.rss?.channel?.[0]?.item ?? [];
    const atomItems: RssItem[] = parsed?.feed?.entry ?? [];
    const items = rssItems.length ? rssItems : atomItems;

    return items
      .slice(0, 10)
      .map(
        (item, i): Article => ({
          id: `rss-${index}-${i}-${Date.now()}`,
          title: parseTitle(item.title?.[0]),
          url: parseLink(item),
          source: feed.name,
          publishedAt: parseDate(item),
          views: 0,
          comments: 0,
        })
      )
      .filter((a) => a.title && a.url);
  });
}

export async function fetchArticles(): Promise<Article[]> {
  const feeds: RssFeed[] = (sourcesConfig as any).rssFeeds ?? [];
  const results = await Promise.all(feeds.map((feed, i) => fetchFeed(feed, i)));
  return results.flat();
}
