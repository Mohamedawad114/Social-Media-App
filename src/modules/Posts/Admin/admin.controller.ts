/**
 * @swagger
 * tags:
 *   name: Admin - Posts
 *   description: Admin controls for managing posts
 */

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

import { IsAdmin, verifyToken } from "../../../middlwares";
import AdminPostServices from "./admin.services";
import { Router } from "express";

const adminPostController = Router();

adminPostController.delete(
  "/:postId",
  verifyToken,
  IsAdmin,
  AdminPostServices.deletepost
);

export { adminPostController }
