"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionSchema = exports.updatePostSchema = exports.postSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.postSchema = {
    body: zod_1.default.object({
        content: zod_1.default.union([
            zod_1.default.string().min(1).max(5000),
            zod_1.default.object({
                text: zod_1.default.string().min(1).max(5000),
            }),
        ]).optional(),
    })
};
exports.updatePostSchema = {
    body: zod_1.default.object({
        content: zod_1.default.string().min(1).max(5000),
    }),
    params: zod_1.default.object({
        postId: zod_1.default.string().trim().length(24),
    })
};
exports.reactionSchema = {
    body: zod_1.default.object({
        reaction: zod_1.default.number().min(0).max(6),
    }),
    params: zod_1.default.object({
        postId: zod_1.default.string().trim().length(24),
    })
};
