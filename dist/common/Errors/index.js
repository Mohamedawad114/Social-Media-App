"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notAuthorizedException = exports.BadRequestException = exports.notFoundException = exports.conflictException = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, error) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }
}
exports.AppError = AppError;
class conflictException extends AppError {
    constructor(message, error) {
        super(message, 409, error);
        this.error = error;
    }
}
exports.conflictException = conflictException;
class notFoundException extends AppError {
    constructor(message, error) {
        super(message, 404, error);
        this.error = error;
    }
}
exports.notFoundException = notFoundException;
class BadRequestException extends AppError {
    constructor(message, error) {
        super(message, 400, error);
        this.error = error;
    }
}
exports.BadRequestException = BadRequestException;
class notAuthorizedException extends AppError {
    constructor(message, error) {
        super(message, 401, error);
        this.error = error;
    }
}
exports.notAuthorizedException = notAuthorizedException;
