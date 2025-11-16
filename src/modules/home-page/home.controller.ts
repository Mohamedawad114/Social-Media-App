/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Routes for feeds and search functionality
 */

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Get user feed posts
 *     description: Returns posts from users that the current user follows, sorted by latest.
 *     tags: [Home]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully fetched feed posts
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /home/search:
 *   get:
 *     summary: Search for users or posts
 *     description: Allows the authenticated user to search for other users or posts by a keyword.
 *     tags: [Home]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search keyword
 *         schema:
 *           type: string
 *           example: "mohamed"
 *     responses:
 *       200:
 *         description: Search results found
 *       400:
 *         description: Missing or invalid query
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /home/search/{userId}:
 *   get:
 *     summary: Get posts of a specific user
 *     description: Fetches all posts created by a specific user using their ID.
 *     tags: [Home]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user whose posts are to be fetched
 *         schema:
 *           type: string
 *           example: "671fa2088e3a5d8f67c58d12"
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

import { Router } from "express";
import { verifyToken } from "../../middlwares";
import homeServices from "./home.services";

const homeRouter = Router();

homeRouter.get("/search", verifyToken, homeServices.search);
homeRouter.get("/", verifyToken, homeServices.getFeedsPosts);
homeRouter.get("/search/:userId", verifyToken, homeServices.getUserPosts);

export { homeRouter };
