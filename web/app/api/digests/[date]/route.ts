import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { DigestDetail } from '@/types/digest';
import { formatDateLong, formatDateShort, formatSentAt, isToday, formatArticleDate } from '@/lib/formatDate';

export const revalidate = 300;

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  const supabase = getSupabase();

  const { data: digest, error: digestError } = await supabase
    .from('digests')
    .select('id, date, article_count, sent_at')
    .eq('date', params.date)
    .single();

  if (digestError || !digest) {
    return NextResponse.json({ error: 'Digest not found' }, { status: 404 });
  }

  const { data: rows, error: articlesError } = await supabase
    .from('digest_articles')
    .select('position, articles(title, translated_title, url, source, summary, published_at)')
    .eq('digest_id', digest.id)
    .order('position', { ascending: true });

  if (articlesError) return NextResponse.json({ error: articlesError.message }, { status: 500 });

  const articles = (rows ?? []).map((row: any) => ({
    pos: row.position,
    source: row.articles?.source ?? 'hn',
    title: row.articles?.translated_title ?? row.articles?.title ?? '',
    summary: row.articles?.summary ?? null,
    originalDate: row.articles?.published_at ? formatArticleDate(row.articles.published_at) : '',
    url: row.articles?.url ?? '#',
  }));

  const result: DigestDetail = {
    date: digest.date,
    dateFormatted: formatDateLong(digest.date),
    dateShort: formatDateShort(digest.date),
    sentAt: formatSentAt(digest.sent_at),
    isToday: isToday(digest.date),
    articles,
  };

  return NextResponse.json(result);
}
