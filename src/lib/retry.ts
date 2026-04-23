export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  shouldRetry?: (err: unknown) => boolean;
  onRetry?: (err: unknown, attempt: number) => void;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { maxAttempts, delayMs, shouldRetry, onRetry } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;
      if (shouldRetry && !shouldRetry(err)) break;
      onRetry?.(err, attempt);
      if (delayMs > 0) await sleep(delayMs);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
