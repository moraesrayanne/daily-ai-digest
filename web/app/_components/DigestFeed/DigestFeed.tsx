import { DigestCard } from '@/components/DigestCard';
import { getDigests } from '@/lib/repositories/digestRepository';

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
