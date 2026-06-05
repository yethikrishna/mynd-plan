/** Retry an async fn with exponential backoff + jitter. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { retries?: number; baseMs?: number; onRetry?: (attempt: number, err: unknown) => void } = {}
): Promise<T> {
  const { retries = 3, baseMs = 300, onRetry } = opts;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      onRetry?.(attempt + 1, err);
      const delay = baseMs * 2 ** attempt + Math.random() * baseMs;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

/** Wrap a promise with a timeout. Rejects if it exceeds ms. */
export function withTimeout<T>(p: Promise<T>, ms: number, label = 'operation'): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}
