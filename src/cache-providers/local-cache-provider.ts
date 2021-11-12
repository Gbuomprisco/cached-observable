import { CacheProvider } from './cache-provider';
import { memoryCacheProvider } from './memory-cache-provider';
import { storageCacheProvider } from './storage-cache-provider';

// use this as this file is being rejected by Node
declare const window: any;

export function localCacheProvider<T>(): CacheProvider<T> {
  const storage = window?.localStorage;

  return storage ? storageCacheProvider(storage) : memoryCacheProvider();
}
