import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DigestClient } from './DigestClient';
import { ArticleList } from './ArticleList';
import { formatDateLong, formatDateShort, formatSentAt, isToday } from '@/lib/formatDate';

export const revalidate = 0;

function ArticleListSkeleton() {
  return (
    <div style={{ marginTop: 4 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--border)', flexShrink: 0, animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 60}ms` }} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 70, height: 18, borderRadius: 100, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 60}ms` }} />
                <div style={{ width: 90, height: 12, borderRadius: 4, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 60}ms` }} />
              </div>
              <div style={{ width: '85%', height: 17, borderRadius: 5, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 60}ms` }} />
            </div>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--border)', flexShrink: 0, animation: 'pulse 1.6s ease-in-out infinite' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

async function getSentAt(date: string): Promise<string> {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  const { data } = await supabase
    .from('digests')
    .select('sent_at')
    .eq('date', date)
    .single();
  return data?.sent_at ? formatSentAt(data.sent_at) : '';
}

export default async function DigestPage({ params }: { params: { date: string } }) {
  const { date } = params;
  const sentAt = await getSentAt(date);

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
      <DigestClient
        dateShort={formatDateShort(date)}
        dateFormatted={formatDateLong(date)}
        sentAt={sentAt}
        isToday={isToday(date)}
      />
      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleList date={date} />
      </Suspense>
    </main>
  );
}
