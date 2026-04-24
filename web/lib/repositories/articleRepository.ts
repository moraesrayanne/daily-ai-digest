import { ArticleDetail } from '@/types/digest';
import { getSupabase } from '@/lib/supabase';
import { formatArticleDate } from '@/lib/formatDate';

function mapArticleRow(row: any): ArticleDetail {
  return {
    pos: row.position,
    source: row.articles?.source ?? 'hn',
    title: row.articles?.translated_title ?? row.articles?.title ?? '',
    summary: row.articles?.summary ?? null,
    originalDate: row.articles?.published_at ? formatArticleDate(row.articles.published_at) : '',
    url: row.articles?.url ?? '#',
  };
}

export async function getArticlesByDate(date: string): Promise<ArticleDetail[]> {
  const supabase = getSupabase();

  const { data: digest, error } = await supabase
    .from('digests')
    .select('id')
    .eq('date', date)
    .single();

  if (error || !digest) return [];

  const { data: articleRows } = await supabase
    .from('digest_articles')
    .select('position, articles(title, translated_title, url, source, summary, published_at)')
    .eq('digest_id', digest.id)
    .order('position', { ascending: true })
    .limit(10);

  return (articleRows ?? []).map(mapArticleRow);
}
