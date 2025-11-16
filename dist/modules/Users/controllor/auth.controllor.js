"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllor = void 0;
const common_1 = require("../../../common");
const middlwares_1 = require("../../../middlwares");
const Auth_services_1 = __importDefault(require("../services/Auth.services"));
const express_1 = require("express");
const authControllor = (0, express_1.Router)();
exports.authControllor = authControllor;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & Authorization APIs
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: MohamedAwad
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       201:
 *         description: User created successfully. Verification email sent.
 *       400:
 *         description: Invalid input or user already exists.
 */
authControllor.post("/signup", (0, middlwares_1.validate)(common_1.signupSchema), Auth_services_1.default.SignUp);
/**
 * @swagger
 * /auth/signup-gmail:
 *   post:
 *     summary: Sign up or login using Google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User authenticated successfully using Google.
 *       400:
 *         description: Google authentication failed.
 */
authControllor.post("/signup-gmail", Auth_services_1.default.signWithGoogle);
/**
 * @swagger
 * /auth/confirmEmail:
 *   post:
 *     summary: Confirm user email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email confirmed successfully.
 *       400:
 *         description: Invalid OTP or email not found.
 */
authControllor.post("/confirmEmail", (0, middlwares_1.validate)(common_1.confirmEmailSchema), Auth_services_1.default.confrim_email);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns access & refresh tokens.
 *       401:
 *         description: Invalid credentials.
 */
authControllor.post("/login", (0, middlwares_1.validate)(common_1.loginSchema), Auth_services_1.default.loginuser);
/**
 * @swagger
 * /auth/resendOTP:
 *   get:
 *     summary: Resend OTP for email verification
 *     tags: [Auth]
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: test@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully.
 *       400:
 *         description: Failed to resend OTP.
 */
authControllor.get("/resendOTP", Auth_services_1.default.resendOTP);
/**
 * @swagger
 * /auth/refresh-token:
 *   get:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *       403:
 *         description: Invalid or expired refresh token.
 */
authControllor.get("/refresh-token", Auth_services_1.default.refreshToken);
