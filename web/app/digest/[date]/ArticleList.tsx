import { getSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArticleRow } from '@/components/ArticleRow';
import { ArticleDetail } from '@/types/digest';
import { formatArticleDate } from '@/lib/formatDate';
import { ArticleListClient } from './ArticleListClient';

async function getArticles(date: string): Promise<ArticleDetail[]> {
  const supabase = getSupabase();

  const { data: digest, error } = await supabase
    .from('digests')
    .select('id')
    .eq('date', date)
    .single();

  if (error || !digest) notFound();

  const { data: rows } = await supabase
    .from('digest_articles')
    .select('position, articles(title, translated_title, url, source, summary, published_at)')
    .eq('digest_id', digest.id)
    .order('position', { ascending: true })
    .limit(10);

  return (rows ?? []).map((row: any) => ({
    pos: row.position,
    source: row.articles?.source ?? 'hn',
    title: row.articles?.translated_title ?? row.articles?.title ?? '',
    summary: row.articles?.summary ?? null,
    originalDate: row.articles?.published_at ? formatArticleDate(row.articles.published_at) : '',
    url: row.articles?.url ?? '#',
  }));
}

export async function ArticleList({ date }: { date: string }) {
  const articles = await getArticles(date);
  return <ArticleListClient articles={articles} />;
}
