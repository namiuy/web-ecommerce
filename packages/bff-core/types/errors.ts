export const httpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  GONE: 410,
  ALREADY_EXIST: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

export type RequestError = {
  httpStatus: number;
  message: string;
};

// Error factory functions (functional approach)
export const createRequestError = (httpStatus: number, message: string): RequestError => ({
  httpStatus,
  message,
});

export const createUnhandledError = (message: string): RequestError =>
  createRequestError(httpStatus.SERVER_ERROR, message);

export const createNotFoundError = (message = 'Not found'): RequestError =>
  createRequestError(httpStatus.NOT_FOUND, message);

export const createInvalidParametersError = (message = 'Invalid parameters'): RequestError =>
  createRequestError(httpStatus.UNPROCESSABLE_ENTITY, message);

export const createAlreadyExistError = (message = 'Already exist'): RequestError =>
  createRequestError(httpStatus.BAD_REQUEST, message);

export const createUnauthorizedError = (message = 'Unauthorized'): RequestError =>
  createRequestError(httpStatus.UNAUTHORIZED, message);

// Pre-defined common errors
export const NOT_FOUND = createNotFoundError();
export const INVALID_PARAMETERS = createInvalidParametersError();
export const ALREADY_EXIST = createAlreadyExistError();
export const EMAIL_ALREADY_IN_USE = createRequestError(httpStatus.BAD_REQUEST, 'Email already in use');
export const THE_USER_OR_PASSWORD_IS_INCORRECT = createRequestError(
  httpStatus.UNAUTHORIZED,
  'The user or password is incorrect'
);
export const UNAUTHORIZED = createUnauthorizedError();
export const SERVER_ERROR = createRequestError(httpStatus.SERVER_ERROR, 'Server error');
export const TIMED_OUT = createRequestError(httpStatus.TOO_MANY_REQUESTS, 'Timed out');
export const EXPIRED_TOKEN = createRequestError(httpStatus.GONE, 'Expired token');
export const INVALID_TOKEN = createRequestError(httpStatus.UNAUTHORIZED, 'Invalid token');
