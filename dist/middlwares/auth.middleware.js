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
exports.verifyGraphQLContext = verifyGraphQLContext;
exports.verifyToken = verifyToken;
exports.IsAdmin = IsAdmin;
exports.isFreezed = isFreezed;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const models_1 = require("../DB/models");
const Errors_1 = require("../common/Errors");
const utils_1 = require("../utils");
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        try {
            if (!token)
                throw new Errors_1.notAuthorizedException("no token provided");
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            if (yield utils_1.redis.get(`tokens_blacklist:${token}`)) {
                throw new Errors_1.notAuthorizedException("token expired or logout");
            }
            const user = yield models_1.UserModel.findById(decoded.id);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            req.user = user;
            next();
        }
        catch (err) {
            return res
                .status(401)
                .json((0, utils_1.FailerResponse)("Invalid or expired token", 401));
        }
    });
}
function isFreezed(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!req.user)
            throw new Errors_1.notAuthorizedException("user not found");
        const isFreezed = yield utils_1.redis.get(`freeze:${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}`);
        if (isFreezed)
            throw new Errors_1.notAuthorizedException("your account freezed please try again later");
        next();
    });
}
function IsAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            throw new Errors_1.notAuthorizedException("user not found");
        if (req.user.role !== "admin")
            return res.json((0, utils_1.FailerResponse)("Access denied, Admins only", 403));
        next();
    });
}
function verifyGraphQLContext(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new Errors_1.notAuthorizedException("no token provided");
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            throw new Errors_1.notAuthorizedException("no token provided");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const User = yield models_1.UserModel.findById(decoded.id);
        if (!User)
            throw new Errors_1.notFoundException("user not found");
        return User;
    });
}
