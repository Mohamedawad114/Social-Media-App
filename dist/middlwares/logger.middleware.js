"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = require("pino-http");
exports.logger = (0, pino_1.default)({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss" },
    },
});
exports.httpLogger = (0, pino_http_1.pinoHttp)({
    logger: exports.logger,
    autoLogging: true,
    customLogLevel: (res, err) => {
        if (res.statusCode >= 500 || err)
            return "error";
        if (res.statusCode >= 400)
            return "warn";
        return "info";
    },
});
