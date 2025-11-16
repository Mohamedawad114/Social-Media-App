import { loginSchema, signupSchema, confirmEmailSchema } from "../../../common";
import { validate } from "../../../middlwares";
import AuthServices from "../services/Auth.services";
import { Router } from "express";
const authControllor = Router();

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
authControllor.post("/signup", validate(signupSchema), AuthServices.SignUp);

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
authControllor.post("/signup-gmail", AuthServices.signWithGoogle);

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
authControllor.post(
  "/confirmEmail",
  validate(confirmEmailSchema),
  AuthServices.confrim_email
);

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
authControllor.post("/login", validate(loginSchema), AuthServices.loginuser);

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
authControllor.get("/resendOTP", AuthServices.resendOTP);

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
authControllor.get("/refresh-token", AuthServices.refreshToken);

export { authControllor };
