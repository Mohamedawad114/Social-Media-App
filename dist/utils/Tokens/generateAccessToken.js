"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../../common");
const generateAccessToken = ({ id, role = common_1.Sys_Role.user, username }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: id, role: role, username }, process.env.SECRET_KEY, {
        expiresIn: "30m",
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
