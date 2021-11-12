import { CachePayload } from './cache-payload.interface';
import { CacheProvider } from './cache-provider';

const cache = new Map<string, CachePayload<unknown>>();

export function memoryCacheProvider<T>(): CacheProvider<T> {
  return {
    get(key: string) {
      return cache.get(key) as CachePayload<T> | undefined;
    },
    set(key: string, value: CachePayload<T>) {
      cache.set(key, value);
    },
    unset(key: string) {
      cache.delete(key);
    },
  };
}
