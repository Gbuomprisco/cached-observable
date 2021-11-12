import { lastValueFrom, mergeMap, of, tap, timer } from 'rxjs';

import { cachedObservable, invalidateCachedObservable } from './';

import { CacheProviderType } from './cache-providers/cache-provider-type';

describe('cachedObservable', () => {
  jest.useFakeTimers();

  const tick = (ms = 0) => {
    jest.advanceTimersByTime(ms);
  };

  it('should return the same value', () => {
    const stream = () => of(1);
    const key = '1';

    const createStream = () => {
      return cachedObservable(stream(), key);
    };

    expect(createStream()).toBe(createStream());
  });

  it('should not call the inner observable again', async () => {
    const spy = jest.fn(() => 1);
    const key = '2';

    const createStream = (key: string) => {
      const stream$ = of(1).pipe(
        mergeMap(() => {
          return of(1).pipe(tap(spy));
        }),
      );

      return lastValueFrom(cachedObservable(stream$, key));
    };

    await createStream(key);
    await createStream(key);
    await createStream(key + key);
    await createStream(key);

    await tick();

    invalidateCachedObservable(CacheProviderType.Memory, key);
    await createStream(key);

    await tick();

    expect(spy).toHaveBeenCalledTimes(3);

    return true;
  });

  describe('given a max age', () => {
    describe('and the key did not expire', () => {
      it('should keep the value', async () => {
        const spy = jest.fn(() => 1);
        const key = '3';

        const createStream = (key: string) => {
          const stream$ = of(1).pipe(
            mergeMap(() => {
              return of(1).pipe(tap(spy));
            }),
          );

          return lastValueFrom(cachedObservable(stream$, key, 500));
        };

        await createStream(key);
        await tick(30);

        await createStream(key);
        await tick(470);

        await createStream(key);

        expect(spy).toHaveBeenCalledTimes(2);

        return true;
      });
    });

    describe('and the key expired', () => {
      it('should no longer store the value', async () => {
        const spy = jest.fn(() => 1);
        const key = '4';

        const createStream = (key: string) => {
          const stream$ = of(1).pipe(
            mergeMap(() => {
              return of(1).pipe(tap(spy));
            }),
          );

          return lastValueFrom(cachedObservable(stream$, key, 500));
        };

        await createStream(key);
        await tick(250);

        await createStream(key);
        await tick(250);

        await createStream(key);

        expect(spy).toHaveBeenCalledTimes(2);

        return true;
      });
    });
  });

  it('emits 5 times', async () => {
    const fn = jest.fn(() => 1);
    const stream$ = timer(0, 100).pipe(tap(fn));

    stream$.subscribe();

    await tick(499);

    expect(fn.mock.calls.length).toEqual(5);
  });
});
