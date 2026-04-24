import { NextResponse } from 'next/server';
import { getDigestByDate } from '@/lib/repositories/digestRepository';

export const revalidate = 300;

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  const digest = await getDigestByDate(params.date);
  if (!digest) return NextResponse.json({ error: 'Digest not found' }, { status: 404 });
  return NextResponse.json(digest);
}
