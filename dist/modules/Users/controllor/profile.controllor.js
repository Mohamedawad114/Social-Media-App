"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileControllor = void 0;
const common_1 = require("../../../common");
const middlwares_1 = require("../../../middlwares");
const Notitifcations_controller_1 = require("../../Notifications/Notitifcations.controller");
const profile_services_1 = __importDefault(require("../services/profile.services"));
const express_1 = require("express");
const profileControllor = (0, express_1.Router)({ mergeParams: true });
exports.profileControllor = profileControllor;
profileControllor.use("/notifications", Notitifcations_controller_1.notificationsControllor);
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
profileControllor.get("/Info", middlwares_1.verifyToken, profile_services_1.default.profile);
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
profileControllor.get("/reset-password", middlwares_1.verifyToken, profile_services_1.default.resetPasswordreq);
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
profileControllor.get("/resend-OTP", middlwares_1.verifyToken, profile_services_1.default.resendOTP_reset);
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
profileControllor.get("/friend-requests", middlwares_1.verifyToken, profile_services_1.default.listRequests);
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
profileControllor.get("/blocked-users", middlwares_1.verifyToken, profile_services_1.default.blockFriendsList);
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
profileControllor.get("/group-list", middlwares_1.verifyToken, profile_services_1.default.listUserGroups);
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
profileControllor.post("/profile-picture", middlwares_1.verifyToken, (0, middlwares_1.uploadFile)().single("profile"), profile_services_1.default.uploadProfile_pic);
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
profileControllor.post("/cover-picture", middlwares_1.verifyToken, (0, middlwares_1.uploadFile)().single("cover"), profile_services_1.default.uploadCover_pic);
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
profileControllor.post("/renew-signedUrl", middlwares_1.verifyToken, profile_services_1.default.renew_SignedUrl);
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
profileControllor.post("/friend-request", middlwares_1.verifyToken, profile_services_1.default.sendFreindship);
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
profileControllor.post("/create-group", middlwares_1.verifyToken, profile_services_1.default.createGroup);
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
profileControllor.put("/update", middlwares_1.verifyToken, (0, middlwares_1.validate)(common_1.updateUserSchema), profile_services_1.default.Updateuser);
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
profileControllor.put("/update-password", (0, middlwares_1.validate)(common_1.updatePasswordSchema), middlwares_1.verifyToken, profile_services_1.default.updatePassword);
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
profileControllor.put("/reset-password-confirmation", middlwares_1.verifyToken, (0, middlwares_1.validate)(common_1.resetPasswordSchema), profile_services_1.default.resetPasswordconfrim);
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
profileControllor.patch("/rsponse-friendship", middlwares_1.verifyToken, (0, middlwares_1.validate)(common_1.responseFreindshipSchema), profile_services_1.default.responseFreindship);
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
profileControllor.patch("/blockUser", middlwares_1.verifyToken, (0, middlwares_1.validate)(common_1.blockuserSchema), profile_services_1.default.blockFriend);
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
profileControllor.patch("/unblockUser", middlwares_1.verifyToken, (0, middlwares_1.validate)(common_1.blockuserSchema), profile_services_1.default.unBlockFriend);
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
profileControllor.delete("/unfriend", middlwares_1.verifyToken, profile_services_1.default.unfriend);
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
profileControllor.delete("/logout", profile_services_1.default.logout);
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
profileControllor.delete("/logout-all", profile_services_1.default.logoutAllDevices);
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
profileControllor.delete("/delete", middlwares_1.verifyToken, profile_services_1.default.deleteAccount);
