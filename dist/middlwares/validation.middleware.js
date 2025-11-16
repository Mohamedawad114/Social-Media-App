"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFeilds = exports.validate = void 0;
const Errors_1 = require("../common/Errors");
const zod_1 = __importDefault(require("zod"));
const validate = (schema) => {
    return (req, res, next) => {
        var _a, _b;
        const Keys = ["body", "params", "query"];
        const validationErrors = [];
        for (const key of Keys) {
            if (schema[key]) {
                const result = schema[key].safeParse(req[key]);
                if (!result.success) {
                    const issues = (_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues) === null || _b === void 0 ? void 0 : _b.map((issue) => ({
                        path: issue.path,
                        message: issue.message,
                    }));
                    validationErrors.push(...issues);
                }
            }
        }
        if (validationErrors.length)
            throw new Errors_1.BadRequestException("validation Errors", { validationErrors });
        next();
    };
};
exports.validate = validate;
exports.generalFeilds = {
    username: zod_1.default
        .string({
        error: "Username is required",
    })
        .min(6, "Username must be at least 6 characters")
        .max(20, "Username must be less than 20 characters")
        .trim(),
    phone: zod_1.default
        .string({
        error: "Phone number is required",
    })
        .length(11, { message: "Phone number must be exactly 11 digits" }),
    DOB: zod_1.default.coerce.date(),
    email: zod_1.default.email({ message: "Invalid email format" }),
    role: zod_1.default.string().optional().default("user"),
    password: zod_1.default
        .string({
        error: "Password is required",
    })
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
};
