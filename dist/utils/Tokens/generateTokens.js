"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const redis_1 = require("../services/redis");
const common_1 = require("../../common");
const generateTokens = (_a) => __awaiter(void 0, [_a], void 0, function* ({ res, role = common_1.Sys_Role.user, id, username }) {
    const jti = (0, uuid_1.v4)();
    const accessToken = jsonwebtoken_1.default.sign({
        id: id,
        role: role,
        username
    }, process.env.SECRET_KEY, {
        expiresIn: "30m",
    });
    redis_1.redis.set(`accessToken:${id}:${jti}`, "1", "EX", 60 * 30);
    const refreshToken = jsonwebtoken_1.default.sign({
        id: id,
        role: role,
        username,
        jti,
    }, process.env.SECRET_KEY, {
        expiresIn: "7d",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return accessToken;
});
exports.generateTokens = generateTokens;
