# cached-observable

## A simple utility to cache RxJS Observables in memory, Session and Local Storage

This utility allows you to cache streams in memory, or Web Storage. It also 
works in Node, but please only use in-memory if you do so. 

In the future, it will be extended with he ability provide a way to provide a 
custom CacheProviderType, 
such as Redis.

## Install

```bash
npm i cached-observable --save
```

## Usage

### Interface

The utility has the following interface:

```typescript
function cachedObservable<T = unknown>(
    observable$: Observable<T>,
    key: string,
    maxAge?: number | undefined,
    cacheProviderType = CacheProviderType.Memory,
)
```

- `observable$` is the stream we want to cache
- `key` is a unique key - please make sure it is unique
- `maxAge` is a value, in milliseconds, that represents the amount of time the 
  value will be cached for
- `cacheProviderType` is by default in-memory, you can also choose 
  `CacheProviderType.Persistent` or `CacheProviderType.Session`

### Basic Example

A basic example; the stream is cached in memory for the whole duration of 
the session.

```typescript
import { cachedObservable } from 'cached-observable';

function getTodos() {
  const request$ = this.http.get(url);
  const key = url;
  
  return cachedObservable(request$, key);
}
```

### Expiry Time

We can set a max-age - so that the entry will expire after the number of 
milliseconds provided

```typescript
import { cachedObservable } from 'cached-observable';

function getTodos() {
  const request$ = this.http.get(url);
  const key = url;
  const maxAge = 60_000; // 1 minute
  
  return cachedObservable(request$, key, maxAge);
}
```

### Web Storage

We can store the streams in both session and local storage:

```typescript
import { cachedObservable, CacheProviderType } from 'cached-observable';

// local storage
function getTodos() {
  const request$ = this.http.get(url);
  
  return cachedObservable(request$, url, maxAge, CacheProviderType.Persistent);
}

// session storage
function getTodos() {
  const request$ = this.http.get(url);

  return cachedObservable(request$, url, maxAge, CacheProviderType.Session);
}
```

### Invalidating Cache

```typescript
import { invalidateCachedObservable } from 'cached-observable';

invalidateCachedObservable(cacheKey, CacheProviderType.Session);
```

