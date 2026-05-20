import { DigestListItem, DigestDetail, ArticleDetail } from '@/types/digest';
import { getSupabase } from '@/lib/supabase';
import { DigestRow, ArticleRow } from '@daily/db';

type ArticleQueryRow = { position: number; articles: Partial<ArticleRow> | null };
import {
  formatDateLong,
  formatDateShort,
  formatSentAt,
  formatArticleDate,
  formatTimeOnly,
  isToday,
} from '@/lib/formatDate';

function mapArticleRow(row: ArticleQueryRow): ArticleDetail {
  return {
    pos: row.position,
    source: row.articles?.source ?? 'hn',
    title: row.articles?.translated_title ?? row.articles?.title ?? '',
    summary: row.articles?.summary ?? null,
    originalDate: row.articles?.published_at ? formatArticleDate(row.articles.published_at) : '',
    url: row.articles?.url ?? '#',
  };
}

export async function getDigests(): Promise<DigestListItem[]> {
  const supabase = getSupabase();

  const { data: digests, error } = await supabase
    .from('digests')
    .select('id, date, article_count, sent_at')
    .order('date', { ascending: false })
    .limit(30);

  if (error || !digests) return [];

  const results: DigestListItem[] = await Promise.all(
    (digests as DigestRow[]).map(async (digest) => {
      const { data: articleRows } = await supabase
        .from('digest_articles')
        .select('position, articles(title, translated_title)')
        .eq('digest_id', digest.id)
        .order('position', { ascending: true })
        .limit(10);

      const titles = ((articleRows ?? []) as ArticleQueryRow[])
        .map((row) => row.articles?.translated_title ?? row.articles?.title ?? '')
        .filter(Boolean) as string[];

      return {
        date: digest.date,
        dateFormatted: formatDateLong(digest.date),
        dateShort: formatDateShort(digest.date),
        sentAt: digest.sent_at ? formatSentAt(digest.sent_at) : '',
        isToday: isToday(digest.date),
        articleCount: digest.article_count ?? 0,
        titles,
      };
    })
  );

  return results;
}

export async function getDigestByDate(date: string): Promise<DigestDetail | null> {
  const supabase = getSupabase();

  const { data: digest, error } = await supabase
    .from('digests')
    .select('id, date, article_count, sent_at')
    .eq('date', date)
    .single();

  if (error || !digest) return null;

  const { data: articleRows } = await supabase
    .from('digest_articles')
    .select('position, articles(title, translated_title, url, source, summary, published_at)')
    .eq('digest_id', (digest as DigestRow).id)
    .order('position', { ascending: true });

  const articles: ArticleDetail[] = ((articleRows ?? []) as ArticleQueryRow[]).map(
    mapArticleRow
  );

  const d = digest as DigestRow;
  return {
    date: d.date,
    dateFormatted: formatDateLong(d.date),
    dateShort: formatDateShort(d.date),
    sentAt: d.sent_at ? formatSentAt(d.sent_at) : '',
    isToday: isToday(d.date),
    articles,
  };
}

export async function getDigestSentAt(date: string): Promise<string> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('digests')
    .select('sent_at')
    .eq('date', date)
    .single();

  if (error || !data) return '';

  return formatSentAt((data as Pick<DigestRow, 'sent_at'>).sent_at);
}

export async function getLastUpdated(): Promise<string | undefined> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('digests')
    .select('sent_at')
    .order('sent_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return undefined;

  return formatTimeOnly((data as Pick<DigestRow, 'sent_at'>).sent_at);
}
