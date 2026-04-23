import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Article } from '../types';

const ARXIV_URL =
  'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL&sortBy=submittedDate&sortOrder=descending&max_results=30';

interface ArxivEntry {
  id: string[];
  title: string[];
  published: string[];
  link?: Array<{ $: { href: string; rel: string } }>;
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const { data: xml } = await axios.get<string>(ARXIV_URL);
    const parsed = await parseStringPromise(xml);
    const entries: ArxivEntry[] = parsed?.feed?.entry ?? [];

    return entries.map((entry, i) => {
      const absLink =
        entry.link?.find((l) => l.$?.rel === 'alternate')?.$.href ??
        (entry.id[0] ?? '');

      return {
        id: `arxiv-${i}-${Date.now()}`,
        title: entry.title[0].trim().replace(/\s+/g, ' '),
        url: absLink,
        source: 'ArXiv',
        publishedAt: new Date(entry.published[0]),
        views: 0,
        comments: 0,
      };
    });
  } catch {
    return [];
  }
}
