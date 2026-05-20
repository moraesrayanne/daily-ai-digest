import { withRetry } from './retry';

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await withRetry(fn, { maxAttempts: 3, delayMs: 0 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds on second attempt', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('ok');

    const result = await withRetry(fn, { maxAttempts: 3, delayMs: 0 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting all attempts', async () => {
    const err = new Error('always fails');
    const fn = jest.fn()
      .mockRejectedValueOnce(err)
      .mockRejectedValueOnce(err)
      .mockRejectedValueOnce(err);

    await expect(withRetry(fn, { maxAttempts: 3, delayMs: 0 })).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('calls onRetry with error and attempt number', async () => {
    const onRetry = jest.fn();
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('e1'))
      .mockResolvedValueOnce('ok');

    await withRetry(fn, { maxAttempts: 3, delayMs: 0, onRetry });
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1);
  });

  it('stops early when shouldRetry returns false', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error('permanent'));
    const shouldRetry = jest.fn().mockReturnValue(false);

    await expect(withRetry(fn, { maxAttempts: 3, delayMs: 0, shouldRetry })).rejects.toThrow('permanent');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledTimes(1);
  });

  it('does not call shouldRetry on the last attempt', async () => {
    const err = new Error('fail');
    const fn = jest.fn()
      .mockRejectedValueOnce(err)
      .mockRejectedValueOnce(err);
    const shouldRetry = jest.fn().mockReturnValue(true);

    await expect(withRetry(fn, { maxAttempts: 2, delayMs: 0, shouldRetry })).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(shouldRetry).toHaveBeenCalledTimes(1);
  });
});
