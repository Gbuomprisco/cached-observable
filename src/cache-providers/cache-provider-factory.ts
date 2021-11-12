import { CacheProviderType } from './cache-provider-type';
import { localCacheProvider } from './local-cache-provider';
import { memoryCacheProvider } from './memory-cache-provider';
import { sessionCacheProvider } from './session-cache-provider';

export function cacheProviderFactory<T = unknown>() {
  const memoryCache = memoryCacheProvider<T>();

  return {
    ofType(type: CacheProviderType) {
      switch (type) {
        case CacheProviderType.Memory:
          return memoryCache;

        case CacheProviderType.Persistent:
          return localCacheProvider<T>();

        case CacheProviderType.Session:
          return sessionCacheProvider<T>();
      }
    },
  };
}
