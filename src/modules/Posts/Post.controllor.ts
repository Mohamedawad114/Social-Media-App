/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: APIs for creating, updating, deleting, and interacting with posts
 */

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

import { postSchema, reactionSchema, updatePostSchema } from "../../common";
import {
  isFreezed,
  IsOwner,
  uploadFile,
  validate,
  verifyToken,
} from "../../middlwares";
import { comment_controller } from "../Comments/comment.controller";
import postServices from "./services/Post.services";
import { Router } from "express";

const postControllor = Router({ mergeParams: true });

postControllor.use("/:postId/comments", comment_controller);
postControllor.get("/", verifyToken, postServices.getMyPosts);
postControllor.get("/:postId", verifyToken, postServices.getPost);
postControllor.get(
  "/:postId/reactions",
  verifyToken,
  postServices.getReactionsUsers
);
postControllor.post(
  "/create",
  verifyToken,
  isFreezed,
  uploadFile().array("attachments"),
  validate(postSchema),
  postServices.createPost
);
postControllor.post(
  "/share/:postId",
  verifyToken,
  isFreezed,
  postServices.sharePost
);
postControllor.put(
  "/:postId/update",
  verifyToken,
  isFreezed,
  validate(updatePostSchema),
  IsOwner,
  postServices.updatePost
);
postControllor.patch(
  "/:postId",
  verifyToken,
  isFreezed,
  validate(reactionSchema),
  postServices.Reaction
);
postControllor.delete(
  "/:postId",
  verifyToken,
  IsOwner,
  isFreezed,
  postServices.deletePost
);

export { postControllor };
