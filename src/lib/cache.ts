/**
 * Tiny TTL cache. In-memory, process-local. Good enough for serverless warm
 * instances and dev; swap for Redis/Upstash in production by replacing get/set.
 */
type Entry<T> = { value: T; expires: number };

const store = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expires) {
    store.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs = 60_000): void {
  store.set(key, { value, expires: Date.now() + ttlMs });
}

/** Memoize an async fn by key with a TTL. Dedupes concurrent calls. */
const inflight = new Map<string, Promise<unknown>>();
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  if (inflight.has(key)) return inflight.get(key) as Promise<T>;
  const p = fn()
    .then((v) => {
      cacheSet(key, v, ttlMs);
      return v;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
