"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailerResponse = FailerResponse;
exports.SuccessResponse = SuccessResponse;
function FailerResponse(message = "failed response", status = 500, error) {
    return {
        meta: {
            status: status,
            success: false
        },
        error: {
            message: message,
            context: error
        }
    };
}
function SuccessResponse(message = "success response progress", status = 200, data) {
    return {
        meta: {
            status: status,
            success: true
        },
        data: {
            message: message,
            context: data
        }
    };
}
