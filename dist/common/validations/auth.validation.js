"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmailSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const middlwares_1 = require("../../middlwares");
const User_Enum_1 = require("../Enums/User.Enum");
exports.signupSchema = {
    body: zod_1.default.object({
        username: middlwares_1.generalFeilds.username,
        phone: zod_1.default.string().length(11),
        DOB: zod_1.default.coerce.date(),
        email: middlwares_1.generalFeilds.email,
        role: zod_1.default.string().optional().default("user"),
        password: middlwares_1.generalFeilds.password,
        gender: zod_1.default.enum([User_Enum_1.Gender.female, User_Enum_1.Gender.male, User_Enum_1.Gender.other]).optional(),
    }),
};
exports.loginSchema = {
    body: zod_1.default.strictObject({
        email: zod_1.default.email(),
        password: middlwares_1.generalFeilds.password,
    }),
};
exports.confirmEmailSchema = {
    body: zod_1.default.strictObject({
        email: zod_1.default.email(),
        OTP: zod_1.default.string().length(6).trim(),
    }),
};
