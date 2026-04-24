import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { ArticleRow } from '@/components/ArticleRow';
import { ArticleDetail } from '@/types/digest';
import { ArticleListClient } from './ArticleListClient';

const MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function formatArticleDate(isoString: string): string {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

async function getArticles(date: string): Promise<ArticleDetail[]> {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

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
