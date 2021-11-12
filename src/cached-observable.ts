import { Observable, of, shareReplay } from 'rxjs';

import { cacheProviderFactory } from './cache-providers/cache-provider-factory';
import { CacheProviderType } from './cache-providers/cache-provider-type';
import { CachePayload } from './cache-providers/cache-payload.interface';

/**
 *
 * @param observable$
 * @param key
 * @param maxAge
 * @param cacheProviderType
 */
export function cachedObservable<T = unknown>(
  observable$: Observable<T>,
  key: string,
  maxAge?: number | undefined,
  cacheProviderType = CacheProviderType.Memory,
): Observable<T> {
  const cacheFactory = cacheProviderFactory<T>();
  const cache = cacheFactory.ofType(cacheProviderType);
  const cached = cache.get(key);

  if (cached) {
    if (cached.expiry !== undefined && isKeyExpired(cached.expiry)) {
      invalidateCachedObservable(cacheProviderType, key);
    } else {
      return cached.value;
    }
  }

  const value = observable$.pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  const lastUpdated = +new Date();
  const expiry = maxAge ? lastUpdated + maxAge : undefined;

  cache.set(key, {
    value,
    expiry,
    lastUpdated,
  });

  return value;
}

function isKeyExpired(expirationDate: number) {
  const currentTimestamp = new Date().getTime();

  return currentTimestamp >= expirationDate;
}

export function invalidateCachedObservable(
  cacheType: CacheProviderType,
  key: string,
) {
  const cacheFactory = cacheProviderFactory();
  const cache = cacheFactory.ofType(cacheType);

  return cache.unset(key);
}

export function updateCacheEntry<Value>(
  cacheType: CacheProviderType,
  key: string,
  value: Value,
) {
  const cacheFactory = cacheProviderFactory();
  const cache = cacheFactory.ofType(cacheType);
  const entry = cache.get(key);

  const lastUpdated = +new Date();
  const expiry = getExpiryTimeFromEntry(entry, lastUpdated);

  const newEntry = {
    value: of(value),
    lastUpdated,
    expiry,
  };

  return cache.set(key, newEntry);
}

function getExpiryTimeFromEntry(
  entry: CachePayload<unknown> | undefined,
  lastUpdated: number
) {
  return entry && entry.expiry ? lastUpdated + entry.expiry : undefined;
}

export { CacheProviderType };
