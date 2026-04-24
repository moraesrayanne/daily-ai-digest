import { notFound } from 'next/navigation';
import { getArticlesByDate } from '@/lib/repositories/articleRepository';
import { ArticleListClient } from './ArticleListClient';

export async function ArticleList({ date }: { date: string }) {
  const articles = await getArticlesByDate(date);
  if (!articles.length) notFound();
  return <ArticleListClient articles={articles} />;
}
