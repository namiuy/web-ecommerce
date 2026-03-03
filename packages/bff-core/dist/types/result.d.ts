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
export declare const createSuccessResult: <T>(data: T) => Result<T>;
export declare const createErrorResult: <T>(error: RequestError) => Result<T>;
export declare const isSuccess: <T>(result: Result<T>) => result is ResultSuccess<T>;
export declare const isError: <T>(result: Result<T>) => result is ResultError;
export {};
//# sourceMappingURL=result.d.ts.map