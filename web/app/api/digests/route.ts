import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { DigestListItem } from '@/types/digest';
import { formatDateLong, formatDateShort, formatSentAt, isToday } from '@/lib/formatDate';

export const revalidate = 300;

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  const { data: digests, error } = await supabase
    .from('digests')
    .select('id, date, article_count, sent_at')
    .order('date', { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: DigestListItem[] = await Promise.all(
    (digests ?? []).map(async (digest) => {
      const { data: articles } = await supabase
        .from('digest_articles')
        .select('position, articles(title, translated_title)')
        .eq('digest_id', digest.id)
        .order('position', { ascending: true })
        .limit(10);

      const titles = (articles ?? []).map((row: any) => row.articles?.translated_title ?? row.articles?.title ?? '').filter(Boolean);

      return {
        date: digest.date,
        dateFormatted: formatDateLong(digest.date),
        dateShort: formatDateShort(digest.date),
        sentAt: formatSentAt(digest.sent_at),
        isToday: isToday(digest.date),
        articleCount: digest.article_count ?? titles.length,
        titles,
      };
    }),
  );

  return NextResponse.json(results);
}
