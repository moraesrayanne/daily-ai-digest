import axios from 'axios';
import { Article } from '../types';
import { withErrorBoundary } from '../lib/error-boundary';

interface DevToArticle {
  id: number;
  title: string;
  url: string;
  published_at: string;
  page_views_count: number;
  comments_count: number;
}

export async function fetchArticles(): Promise<Article[]> {
  return withErrorBoundary('devto', async () => {
    const response = await axios.get<DevToArticle[]>(
      'https://dev.to/api/articles?tag=ai&per_page=30'
    );
    return response.data.map((item) => ({
      id: `devto-${item.id}`,
      title: item.title,
      url: item.url,
      source: 'DevTo',
      publishedAt: new Date(item.published_at),
      views: item.page_views_count ?? 0,
      comments: item.comments_count ?? 0,
    }));
  });
}
