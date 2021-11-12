import { of, filter, take } from 'rxjs';
import { CachePayload } from './cache-payload.interface';
import { CacheProvider } from './cache-provider';

interface WebStorage {
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function storageCacheProvider<T>(storage: WebStorage): CacheProvider<T> {
  return {
    get(key: string) {
      try {
        const payload = storage.getItem(key);

        if (!payload) {
          return;
        }

        const parsed = JSON.parse(payload);

        return {
          ...parsed,
          value: of(parsed.value),
        };
      } catch (e) {
        return;
      }
    },
    set(key: string, payload: CachePayload<T>) {
      payload.value.pipe(take(1), filter(Boolean)).subscribe((value) => {
        storage.setItem(
          key,
          JSON.stringify({
            ...payload,
            value,
          }),
        );
      });
    },
    unset(key: string) {
      storage.removeItem(key);
    },
  };
}
