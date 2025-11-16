import {
  blockuserSchema,
  resetPasswordSchema,
  responseFreindshipSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "../../../common";
import { uploadFile, validate, verifyToken } from "../../../middlwares";
import { notificationsControllor } from "../../Notifications/Notitifcations.controller";
import profilecServices from "../services/profile.services";
import { Router } from "express";

const profileControllor = Router({ mergeParams: true });
profileControllor.use("/notifications", notificationsControllor);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management and social features
 */

/**
 * @swagger
 * /api/profile/Info:
 *   get:
 *     summary: Get current user profile info
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Unauthorized
 */
profileControllor.get("/Info", verifyToken, profilecServices.profile);

/**
 * @swagger
 * /api/profile/reset-password:
 *   get:
 *     summary: Request a password reset code
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password reset request sent successfully
 */
profileControllor.get(
  "/reset-password",
  verifyToken,
  profilecServices.resetPasswordreq
);

/**
 * @swagger
 * /api/profile/resend-OTP:
 *   get:
 *     summary: Resend OTP for password reset
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
profileControllor.get(
  "/resend-OTP",
  verifyToken,
  profilecServices.resendOTP_reset
);

/**
 * @swagger
 * /api/profile/friend-requests:
 *   get:
 *     summary: List all pending friend requests
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friend requests fetched successfully
 */
profileControllor.get(
  "/friend-requests",
  verifyToken,
  profilecServices.listRequests
);

/**
 * @swagger
 * /api/profile/blocked-users:
 *   get:
 *     summary: Get list of blocked users
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blocked users list fetched successfully
 */
profileControllor.get(
  "/blocked-users",
  verifyToken,
  profilecServices.blockFriendsList
);

/**
 * @swagger
 * /api/profile/group-list:
 *   get:
 *     summary: Get list of groups user belongs to
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Groups list fetched successfully
 */
profileControllor.get(
  "/group-list",
  verifyToken,
  profilecServices.listUserGroups
);

/**
 * @swagger
 * /api/profile/profile-picture:
 *   post:
 *     summary: Upload or update user profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 */
profileControllor.post(
  "/profile-picture",
  verifyToken,
  uploadFile().single("profile"),
  profilecServices.uploadProfile_pic
);

/**
 * @swagger
 * /api/profile/cover-picture:
 *   post:
 *     summary: Upload or update user cover photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover photo uploaded successfully
 */
profileControllor.post(
  "/cover-picture",
  verifyToken,
  uploadFile().single("cover"),
  profilecServices.uploadCover_pic
);

/**
 * @swagger
 * /api/profile/renew-signedUrl:
 *   post:
 *     summary: Renew expired AWS signed URLs for images
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URLs renewed successfully
 */
profileControllor.post(
  "/renew-signedUrl",
  verifyToken,
  profilecServices.renew_SignedUrl
);

/**
 * @swagger
 * /api/profile/friend-request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 */
profileControllor.post(
  "/friend-request",
  verifyToken,
  profilecServices.sendFreindship
);

/**
 * @swagger
 * /api/profile/create-group:
 *   post:
 *     summary: Create a new chat group
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Group created successfully
 */
profileControllor.post(
  "/create-group",
  verifyToken,
  profilecServices.createGroup
);

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     summary: Update user profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateUserSchema'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
profileControllor.put(
  "/update",
  verifyToken,
  validate(updateUserSchema),
  profilecServices.Updateuser
);

/**
 * @swagger
 * /api/profile/update-password:
 *   put:
 *     summary: Change current password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updatePasswordSchema'
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
profileControllor.put(
  "/update-password",
  validate(updatePasswordSchema),
  verifyToken,
  profilecServices.updatePassword
);

/**
 * @swagger
 * /api/profile/reset-password-confirmation:
 *   put:
 *     summary: Confirm password reset using OTP
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resetPasswordSchema'
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
profileControllor.put(
  "/reset-password-confirmation",
  verifyToken,
  validate(resetPasswordSchema),
  profilecServices.resetPasswordconfrim
);

/**
 * @swagger
 * /api/profile/rsponse-friendship:
 *   patch:
 *     summary: Accept or reject a friend request
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/responseFreindshipSchema'
 *     responses:
 *       200:
 *         description: Friendship response updated
 */
profileControllor.patch(
  "/rsponse-friendship",
  verifyToken,
  validate(responseFreindshipSchema),
  profilecServices.responseFreindship
);

/**
 * @swagger
 * /api/profile/blockUser:
 *   patch:
 *     summary: Block a specific user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/blockuserSchema'
 *     responses:
 *       200:
 *         description: User blocked successfully
 */
profileControllor.patch(
  "/blockUser",
  verifyToken,
  validate(blockuserSchema),
  profilecServices.blockFriend
);

/**
 * @swagger
 * /api/profile/unblockUser:
 *   patch:
 *     summary: Unblock a specific user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/blockuserSchema'
 *     responses:
 *       200:
 *         description: User unblocked successfully
 */
profileControllor.patch(
  "/unblockUser",
  verifyToken,
  validate(blockuserSchema),
  profilecServices.unBlockFriend
);

/**
 * @swagger
 * /api/profile/unfriend:
 *   delete:
 *     summary: Remove a user from friend list
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unfriended successfully
 */
profileControllor.delete("/unfriend", verifyToken, profilecServices.unfriend);

/**
 * @swagger
 * /api/profile/logout:
 *   delete:
 *     summary: Logout from current device
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
profileControllor.delete("/logout", profilecServices.logout);

/**
 * @swagger
 * /api/profile/logout-all:
 *   delete:
 *     summary: Logout from all devices
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Logged out from all sessions
 */
profileControllor.delete("/logout-all", profilecServices.logoutAllDevices);

/**
 * @swagger
 * /api/profile/delete:
 *   delete:
 *     summary: Delete user account permanently
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
profileControllor.delete(
  "/delete",
  verifyToken,
  profilecServices.deleteAccount
);

export { profileControllor };
