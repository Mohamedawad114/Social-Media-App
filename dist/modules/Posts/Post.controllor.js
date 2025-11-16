"use strict";
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: APIs for creating, updating, deleting, and interacting with posts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postControllor = void 0;
/**
 * @swagger
 * components:
 *   schemas:
 *     PostCreate:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           example: "Just had a great day!"
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *
 *     PostUpdate:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           example: "Updated post content"
 *
 *     Reaction:
 *       type: object
 *       required:
 *         - reactionType
 *       properties:
 *         reactionType:
 *           type: string
 *           enum: [like, love, haha, sad, angry]
 *           example: like
 */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts for the authenticated user
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user posts
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       404:
 *         description: Post not found
 */
/**
 * @swagger
 * /posts/{postId}/reactions:
 *   get:
 *     summary: Get all users who reacted to a specific post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of reactions
 */
/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/PostCreate'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 */
/**
 * @swagger
 * /posts/share/{postId}:
 *   post:
 *     summary: Share an existing post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID to share
 *     responses:
 *       200:
 *         description: Post shared successfully
 *       404:
 *         description: Post not found
 */
/**
 * @swagger
 * /posts/{postId}/update:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Not authorized
 */
/**
 * @swagger
 * /posts/{postId}:
 *   patch:
 *     summary: React to a post (like, love, etc.)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reaction'
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *       400:
 *         description: Invalid reaction type
 */
/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 */
const common_1 = require("../../common");
const middlwares_1 = require("../../middlwares");
const comment_controller_1 = require("../Comments/comment.controller");
const Post_services_1 = __importDefault(require("./services/Post.services"));
const express_1 = require("express");
const postControllor = (0, express_1.Router)({ mergeParams: true });
exports.postControllor = postControllor;
postControllor.use("/:postId/comments", comment_controller_1.comment_controller);
postControllor.get("/", middlwares_1.verifyToken, Post_services_1.default.getMyPosts);
postControllor.get("/:postId", middlwares_1.verifyToken, Post_services_1.default.getPost);
postControllor.get("/:postId/reactions", middlwares_1.verifyToken, Post_services_1.default.getReactionsUsers);
postControllor.post("/create", middlwares_1.verifyToken, middlwares_1.isFreezed, (0, middlwares_1.uploadFile)().array("attachments"), (0, middlwares_1.validate)(common_1.postSchema), Post_services_1.default.createPost);
postControllor.post("/share/:postId", middlwares_1.verifyToken, middlwares_1.isFreezed, Post_services_1.default.sharePost);
postControllor.put("/:postId/update", middlwares_1.verifyToken, middlwares_1.isFreezed, (0, middlwares_1.validate)(common_1.updatePostSchema), middlwares_1.IsOwner, Post_services_1.default.updatePost);
postControllor.patch("/:postId", middlwares_1.verifyToken, middlwares_1.isFreezed, (0, middlwares_1.validate)(common_1.reactionSchema), Post_services_1.default.Reaction);
postControllor.delete("/:postId", middlwares_1.verifyToken, middlwares_1.IsOwner, middlwares_1.isFreezed, Post_services_1.default.deletePost);
