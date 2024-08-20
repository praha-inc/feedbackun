import { err, ok, ResultAsync } from 'neverthrow';

import type { InferErrorTypes, InferOkTypes } from '../types/infer';
import type { Result } from 'neverthrow';

export const structSync = <
  E,
  T extends Record<string, Result<unknown, E>>,
>(record: T): Result<
  { [Key in keyof T]: InferOkTypes<T[Key]> },
  Array<InferErrorTypes<T[keyof T]>>
> => {
  const errors = Object.values(record).filter((result) => result.isErr());
  if (0 < errors.length) {
    return err(errors.map((error) => error.error) as Array<InferErrorTypes<T[keyof T]>>);
  }

  return ok(Object.entries(record).reduce((previous, [key, result]) => {
    if (result.isErr()) throw new Error('unreachable');
    previous[key] = result.value;
    return previous;
  }, {} as Record<string, unknown>) as { [Key in keyof T]: InferOkTypes<T[Key]> });
};

export const structAsync = <
  E,
  T extends Record<string, Result<unknown, E> | ResultAsync<unknown, E>>,
>(record: T): ResultAsync<
  { [Key in keyof T]: InferOkTypes<T[Key]> },
  Array<InferErrorTypes<T[keyof T]>>
> => {
  const results = Object.entries(record).reduce<Array<Result<[string, unknown], unknown> | ResultAsync<[string, unknown], unknown>>>((previous, [key, value]) => {
    previous.push(value.map((result) => [key, result]));
    return previous;
  }, []);

  return ResultAsync.fromSafePromise(Promise.all(results))
    .andThen((results) => {
      const errors = results.filter((result) => result.isErr());
      if (0 < errors.length) {
        return err(errors.map((error) => error.error) as Array<InferErrorTypes<T[keyof T]>>);
      }

      return ok(results.reduce((previous, result) => {
        if (result.isErr()) throw new Error('unreachable');
        previous[result.value[0]] = result.value[1];
        return previous;
      }, {} as Record<string, unknown>) as { [Key in keyof T]: InferOkTypes<T[Key]> });
    });
};
