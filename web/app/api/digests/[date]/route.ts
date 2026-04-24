import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { DigestDetail } from '@/types/digest';
import { formatDateLong, formatDateShort, formatSentAt, isToday } from '@/lib/formatDate';

export const revalidate = 300;

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

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

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
