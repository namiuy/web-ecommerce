"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = exports.isSuccess = exports.createErrorResult = exports.createSuccessResult = void 0;
// Helper functions for creating results (functional approach)
const createSuccessResult = (data) => ({
    data,
    error: null,
});
exports.createSuccessResult = createSuccessResult;
const createErrorResult = (error) => ({
    data: null,
    error,
});
exports.createErrorResult = createErrorResult;
// Type guards
const isSuccess = (result) => result.error === null;
exports.isSuccess = isSuccess;
const isError = (result) => result.error !== null;
exports.isError = isError;
