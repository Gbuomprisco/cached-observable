import { CachePayload } from './cache-payload.interface';

export interface CacheProvider<T> {
  get(key: string): CachePayload<T> | undefined;
  set(key: string, value: CachePayload<T>): void;
  unset(key: string): void;
}
