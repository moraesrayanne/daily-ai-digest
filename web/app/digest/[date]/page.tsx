import { Suspense } from 'react';
import { DigestHeader } from './DigestHeader/DigestHeader';
import { ArticleList } from './ArticleList/ArticleList';
import { ArticleListSkeleton } from './ArticleList/ArticleListSkeleton';
import { getDigestSentAt } from '@/lib/repositories/digestRepository';
import { formatDateLong, isToday } from '@/lib/formatDate';

export const revalidate = 0;

export default async function DigestPage({ params }: { params: { date: string } }) {
  const { date } = params;
  const sentAt = await getDigestSentAt(date);

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
      <DigestHeader
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
