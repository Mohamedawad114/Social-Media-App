"use strict";
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: APIs for managing comments, replies, and reactions on posts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment_controller = void 0;
/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     description: Retrieve all comments related to a specific post.
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post or comments not found
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment details retrieved successfully
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/replies:
 *   get:
 *     summary: Get all replies for a comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/reactions:
 *   get:
 *     summary: Get users who reacted to a comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *       - name: commentId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: List of users who reacted
 */
/**
 * @swagger
 * /posts/{postId}/comments/create:
 *   post:
 *     summary: Create a comment on a post
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is my comment"
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 */
/**
 * @swagger
 * /posts/{postId}/comments/reply/{commentId}:
 *   post:
 *     summary: Reply to a comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a reply"
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Reply created successfully
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/update:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Edited comment"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   patch:
 *     summary: React to a comment (like/dislike)
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 example: "like"
 *     responses:
 *       200:
 *         description: Reaction added/removed successfully
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/delete:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
const middlwares_1 = require("../../middlwares");
const comment_services_1 = __importDefault(require("./services/comment.services"));
const express_1 = require("express");
const comment_controller = (0, express_1.Router)({ mergeParams: true });
exports.comment_controller = comment_controller;
comment_controller.get("/:commentId", middlwares_1.verifyToken, comment_services_1.default.getComment);
comment_controller.get("/", middlwares_1.verifyToken, comment_services_1.default.getComments);
comment_controller.get("/:commentId/replies", middlwares_1.verifyToken, comment_services_1.default.getComments_reply);
comment_controller.get("/:commentId/reactions", middlwares_1.verifyToken, comment_services_1.default.getReactionsUsers);
comment_controller.post("/create", middlwares_1.verifyToken, middlwares_1.isFreezed, (0, middlwares_1.uploadFile)().single("attachment"), comment_services_1.default.createComment);
comment_controller.post("/reply/:commentId", middlwares_1.verifyToken, middlwares_1.isFreezed, (0, middlwares_1.uploadFile)().single("attachment"), comment_services_1.default.createReply);
comment_controller.put("/:commentId/update", middlwares_1.verifyToken, middlwares_1.isFreezed, comment_services_1.default.updateComment);
comment_controller.patch("/:commentId", middlwares_1.verifyToken, middlwares_1.isFreezed, comment_services_1.default.Reaction);
comment_controller.delete("/:commentId/delete", middlwares_1.verifyToken, middlwares_1.isFreezed, comment_services_1.default.deleteComment);
