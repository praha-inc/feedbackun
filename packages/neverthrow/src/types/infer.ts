import type { Result, ResultAsync } from 'neverthrow';

export type InferOkTypes<R> =
  R extends Result<infer T, unknown>
    ? T
    : R extends ResultAsync<infer T, unknown>
      ? T
      : never;

export type InferErrorTypes<R> =
  R extends Result<unknown, infer E>
    ? E
    : R extends ResultAsync<unknown, infer E>
      ? E
      : never;
