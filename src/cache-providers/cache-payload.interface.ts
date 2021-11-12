import { Observable } from 'rxjs';

export interface CachePayload<T> {
  value: Observable<T>;
  expiry: number | undefined;
  lastUpdated: number;
}
