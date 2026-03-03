"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_TOKEN = exports.EXPIRED_TOKEN = exports.TIMED_OUT = exports.SERVER_ERROR = exports.UNAUTHORIZED = exports.THE_USER_OR_PASSWORD_IS_INCORRECT = exports.EMAIL_ALREADY_IN_USE = exports.ALREADY_EXIST = exports.INVALID_PARAMETERS = exports.NOT_FOUND = exports.createUnauthorizedError = exports.createAlreadyExistError = exports.createInvalidParametersError = exports.createNotFoundError = exports.createUnhandledError = exports.createRequestError = exports.httpStatus = void 0;
exports.httpStatus = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    GONE: 410,
    ALREADY_EXIST: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
};
// Error factory functions (functional approach)
const createRequestError = (httpStatus, message) => ({
    httpStatus,
    message,
});
exports.createRequestError = createRequestError;
const createUnhandledError = (message) => (0, exports.createRequestError)(exports.httpStatus.SERVER_ERROR, message);
exports.createUnhandledError = createUnhandledError;
const createNotFoundError = (message = 'Not found') => (0, exports.createRequestError)(exports.httpStatus.NOT_FOUND, message);
exports.createNotFoundError = createNotFoundError;
const createInvalidParametersError = (message = 'Invalid parameters') => (0, exports.createRequestError)(exports.httpStatus.UNPROCESSABLE_ENTITY, message);
exports.createInvalidParametersError = createInvalidParametersError;
const createAlreadyExistError = (message = 'Already exist') => (0, exports.createRequestError)(exports.httpStatus.BAD_REQUEST, message);
exports.createAlreadyExistError = createAlreadyExistError;
const createUnauthorizedError = (message = 'Unauthorized') => (0, exports.createRequestError)(exports.httpStatus.UNAUTHORIZED, message);
exports.createUnauthorizedError = createUnauthorizedError;
// Pre-defined common errors
exports.NOT_FOUND = (0, exports.createNotFoundError)();
exports.INVALID_PARAMETERS = (0, exports.createInvalidParametersError)();
exports.ALREADY_EXIST = (0, exports.createAlreadyExistError)();
exports.EMAIL_ALREADY_IN_USE = (0, exports.createRequestError)(exports.httpStatus.BAD_REQUEST, 'Email already in use');
exports.THE_USER_OR_PASSWORD_IS_INCORRECT = (0, exports.createRequestError)(exports.httpStatus.UNAUTHORIZED, 'The user or password is incorrect');
exports.UNAUTHORIZED = (0, exports.createUnauthorizedError)();
exports.SERVER_ERROR = (0, exports.createRequestError)(exports.httpStatus.SERVER_ERROR, 'Server error');
exports.TIMED_OUT = (0, exports.createRequestError)(exports.httpStatus.TOO_MANY_REQUESTS, 'Timed out');
exports.EXPIRED_TOKEN = (0, exports.createRequestError)(exports.httpStatus.GONE, 'Expired token');
exports.INVALID_TOKEN = (0, exports.createRequestError)(exports.httpStatus.UNAUTHORIZED, 'Invalid token');
