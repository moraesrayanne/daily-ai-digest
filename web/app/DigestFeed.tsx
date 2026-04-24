import { createClient } from '@supabase/supabase-js';
import { DigestCard } from '@/components/DigestCard';
import { DigestListItem } from '@/types/digest';
import { formatDateLong, formatDateShort, formatSentAt, isToday } from '@/lib/formatDate';

async function getDigests(): Promise<DigestListItem[]> {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

  const { data: digests, error } = await supabase
    .from('digests')
    .select('id, date, article_count, sent_at')
    .order('date', { ascending: false })
    .limit(30);

  if (error || !digests) return [];

  return Promise.all(
    digests.map(async (digest) => {
      const { data: articles } = await supabase
        .from('digest_articles')
        .select('position, articles(title, translated_title)')
        .eq('digest_id', digest.id)
        .order('position', { ascending: true })
        .limit(10);

      const titles = (articles ?? [])
        .map((row: any) => row.articles?.translated_title ?? row.articles?.title ?? '')
        .filter(Boolean);

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
}

export async function DigestFeed() {
  const digests = await getDigests();

  return (
    <div style={{ marginTop: 8 }}>
      {digests.map((digest, i) => (
        <DigestCard key={digest.date} digest={digest} index={i} />
      ))}
    </div>
  );
}
