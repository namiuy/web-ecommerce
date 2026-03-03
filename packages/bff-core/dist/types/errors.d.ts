export declare const httpStatus: {
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly NOT_FOUND: 404;
    readonly GONE: 410;
    readonly ALREADY_EXIST: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly SERVER_ERROR: 500;
};
export type RequestError = {
    httpStatus: number;
    message: string;
};
export declare const createRequestError: (httpStatus: number, message: string) => RequestError;
export declare const createUnhandledError: (message: string) => RequestError;
export declare const createNotFoundError: (message?: string) => RequestError;
export declare const createInvalidParametersError: (message?: string) => RequestError;
export declare const createAlreadyExistError: (message?: string) => RequestError;
export declare const createUnauthorizedError: (message?: string) => RequestError;
export declare const NOT_FOUND: RequestError;
export declare const INVALID_PARAMETERS: RequestError;
export declare const ALREADY_EXIST: RequestError;
export declare const EMAIL_ALREADY_IN_USE: RequestError;
export declare const THE_USER_OR_PASSWORD_IS_INCORRECT: RequestError;
export declare const UNAUTHORIZED: RequestError;
export declare const SERVER_ERROR: RequestError;
export declare const TIMED_OUT: RequestError;
export declare const EXPIRED_TOKEN: RequestError;
export declare const INVALID_TOKEN: RequestError;
//# sourceMappingURL=errors.d.ts.map