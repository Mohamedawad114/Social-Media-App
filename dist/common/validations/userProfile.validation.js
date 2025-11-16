"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockuserSchema = exports.responseFreindshipSchema = exports.resetPasswordSchema = exports.updatePasswordSchema = exports.updateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const middlwares_1 = require("../../middlwares");
exports.updateUserSchema = {
    body: zod_1.default.strictObject({
        username: middlwares_1.generalFeilds.username.optional(),
        phone: middlwares_1.generalFeilds.phone.optional(),
        DOB: middlwares_1.generalFeilds.DOB.optional(),
        email: zod_1.default.email({ message: "Invalid email format" }).optional(),
        isPublic: zod_1.default.boolean().optional(),
    }),
};
exports.updatePasswordSchema = {
    body: zod_1.default
        .strictObject({
        oldPassword: middlwares_1.generalFeilds.password,
        newPassword: middlwares_1.generalFeilds.password,
        confirmPassword: middlwares_1.generalFeilds.password,
    })
        .refine((data) => {
        return data.confirmPassword == data.newPassword;
    }, {
        message: "confirmPassword must match newPassword",
        path: ["confirmPassword"],
    }),
};
exports.resetPasswordSchema = {
    body: zod_1.default
        .strictObject({
        OTP: zod_1.default
            .string()
            .length(6, { message: "OTP must be exactly 6 digits" })
            .trim(),
        newPassword: middlwares_1.generalFeilds.password,
        confirmPassword: middlwares_1.generalFeilds.password,
    })
        .refine((data) => {
        return data.confirmPassword == data.newPassword;
    }, {
        message: "confirmPassword must match newPassword",
        path: ["confirmPassword"],
    }),
};
exports.responseFreindshipSchema = {
    body: zod_1.default.strictObject({
        requestFromId: zod_1.default.string().length(24),
        response: zod_1.default.enum(["accepted", "rejected"]),
    }),
};
exports.blockuserSchema = {
    body: zod_1.default.strictObject({
        friendId: zod_1.default.string().length(24),
    }),
};
