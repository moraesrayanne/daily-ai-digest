import { NextResponse } from 'next/server';
import { getDigests } from '@/lib/repositories/digestRepository';

export const revalidate = 300;

export async function GET() {
  const digests = await getDigests();
  return NextResponse.json(digests);
}
