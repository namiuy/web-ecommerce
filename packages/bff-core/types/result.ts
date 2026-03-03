import { RequestError } from './errors';

type ResultSuccess<T> = {
  data: T;
  error: null;
};

type ResultError = {
  data: null;
  error: RequestError;
};

export type Result<T> = ResultSuccess<T> | ResultError;

// Helper functions for creating results (functional approach)
export const createSuccessResult = <T>(data: T): Result<T> => ({
  data,
  error: null,
});

export const createErrorResult = <T>(error: RequestError): Result<T> => ({
  data: null,
  error,
});

// Type guards
export const isSuccess = <T>(result: Result<T>): result is ResultSuccess<T> =>
  result.error === null;

export const isError = <T>(result: Result<T>): result is ResultError =>
  result.error !== null;
