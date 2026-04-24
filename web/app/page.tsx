import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Hero } from './_components/Hero/Hero';
import { DigestFeed } from './_components/DigestFeed/DigestFeed';
import { DigestListSkeleton } from './_components/DigestListSkeleton/DigestListSkeleton';
import { getLastUpdated } from '@/lib/repositories/digestRepository';

export const revalidate = 0;

export default async function HomePage() {
  const lastUpdated = await getLastUpdated();
  return (
    <div>
      <Header lastUpdated={lastUpdated} />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
        <Hero />
        <Suspense fallback={<DigestListSkeleton />}>
          <DigestFeed />
        </Suspense>
      </main>
    </div>
  );
}
