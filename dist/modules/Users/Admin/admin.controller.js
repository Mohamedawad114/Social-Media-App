"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminControllor = void 0;
const middlwares_1 = require("../../../middlwares");
const admin_services_1 = __importDefault(require("./admin.services"));
const express_1 = require("express");
const adminControllor = (0, express_1.Router)();
exports.adminControllor = adminControllor;
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and user moderation endpoints
 */
/**
 * @swagger
 * /api/admin/Dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 usersCount: 250
 *                 postsCount: 1200
 *                 reportsCount: 14
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not admin)
 */
adminControllor.get("/Dashboard", middlwares_1.verifyToken, middlwares_1.IsAdmin, admin_services_1.default.dashboard);
/**
 * @swagger
 * /api/admin/strictFreezeUser/{userId}:
 *   patch:
 *     summary: Strictly freeze a user (full access restriction)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to freeze
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User strictly frozen successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User has been strictly frozen
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user not admin)
 *       404:
 *         description: User not found
 */
adminControllor.patch("/strictFreezeUser/:userId", middlwares_1.verifyToken, middlwares_1.IsAdmin, admin_services_1.default.strictFreezeUser);
/**
 * @swagger
 * /api/admin/FreezeUser/{userId}:
 *   patch:
 *     summary: Temporarily freeze a user for a specific period
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to temporarily freeze
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User temporarily frozen successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User frozen for 7 days
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user not admin)
 *       404:
 *         description: User not found
 */
adminControllor.patch("/FreezeUser/:userId", middlwares_1.verifyToken, middlwares_1.IsAdmin, admin_services_1.default.FreezeUser_peroid);
/**
 * @swagger
 * /api/admin/deleteUser/{userId}:
 *   delete:
 *     summary: Permanently delete a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User deleted permanently
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user not admin)
 *       404:
 *         description: User not found
 */
adminControllor.delete("/deleteUser/:userId", middlwares_1.verifyToken, middlwares_1.IsAdmin, admin_services_1.default.deleteUserAccount);
