import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Article } from '../types';
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

function parseDate(item: RssItem): Date {
  const raw =
    item.pubDate?.[0] ??
    item.published?.[0] ??
    item.updated?.[0] ??
    item['dc:date']?.[0];
  if (!raw) return new Date();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

function parseLink(item: RssItem): string {
  const link = item.link?.[0];
  if (!link) return '';
  // Atom feeds wrap link as object: { $: { href } }
  if (typeof link === 'object' && (link as any)?.$?.href) {
    return (link as any).$.href;
  }
  return String(link).trim();
}

async function fetchFeed(feed: RssFeed, index: number): Promise<Article[]> {
  try {
    const { data: xml } = await axios.get<string>(feed.url, {
      timeout: 10_000,
      headers: { 'User-Agent': 'Daily-AI-Digest/1.0' },
    });

    const parsed = await parseStringPromise(xml, { explicitArray: true });

    // RSS 2.0
    const rssItems: RssItem[] = parsed?.rss?.channel?.[0]?.item ?? [];
    // Atom
    const atomItems: RssItem[] = parsed?.feed?.entry ?? [];
    const items = rssItems.length ? rssItems : atomItems;

    return items.slice(0, 10).map((item, i): Article => ({
      id: `rss-${index}-${i}-${Date.now()}`,
      title: (item.title?.[0] ?? '').replace(/<[^>]+>/g, '').trim(),
      url: parseLink(item),
      source: feed.name,
      publishedAt: parseDate(item),
      views: 0,
      comments: 0,
    })).filter((a) => a.title && a.url);
  } catch (err) {
    console.warn(`[rss] failed to fetch ${feed.name}:`, (err as any)?.message ?? err);
    return [];
  }
}

export async function fetchArticles(): Promise<Article[]> {
  const feeds: RssFeed[] = (sourcesConfig as any).rssFeeds ?? [];
  const results = await Promise.all(feeds.map((feed, i) => fetchFeed(feed, i)));
  return results.flat();
}
