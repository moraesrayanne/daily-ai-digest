import { warn } from './logger';

export async function withErrorBoundary<T>(
  name: string,
  fn: () => Promise<T[]>
): Promise<T[]> {
  try {
    return await fn();
  } catch (err) {
    warn(name, `failed: ${(err as any)?.message ?? err}`);
    return [];
  }
}
