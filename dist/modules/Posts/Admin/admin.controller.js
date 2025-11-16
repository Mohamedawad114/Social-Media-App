"use strict";
/**
 * @swagger
 * tags:
 *   name: Admin - Posts
 *   description: Admin controls for managing posts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPostController = void 0;
/**
 * @swagger
 * /admin/posts/{postId}:
 *   delete:
 *     summary: Delete a post (Admin only)
 *     description: Allows an admin to permanently delete a specific post by its ID.
 *     tags: [Admin - Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: string
 *           example: "671f9c4a8d8b0e25f1d3ab77"
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not an admin user)
 *       404:
 *         description: Post not found
 */
const middlwares_1 = require("../../../middlwares");
const admin_services_1 = __importDefault(require("./admin.services"));
const express_1 = require("express");
const adminPostController = (0, express_1.Router)();
exports.adminPostController = adminPostController;
adminPostController.delete("/:postId", middlwares_1.verifyToken, middlwares_1.IsAdmin, admin_services_1.default.deletepost);
