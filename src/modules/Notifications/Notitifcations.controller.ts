import { Router } from "express";
import NotificationsServices from "./Notifications.services";
import { verifyToken } from "../../middlwares";

const notificationsControllor = Router({ mergeParams: true });

/**
 * @swagger
 * /notifications/nuRead-notifications:
 *   get:
 *     summary: Get all unread notifications (Realtime supported)
 *     description: |
 *       Retrieves all unread notifications for the logged-in user.
 *       This endpoint supports realtime updates via Socket.IO.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unread notifications
 *       401:
 *         description: Unauthorized
 */
notificationsControllor.get(
  "/nuRead-notifications",
  verifyToken,
  NotificationsServices.unReadNotifications
);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all read notifications (Realtime supported)
 *     description: |
 *       Retrieves all read notifications for the logged-in user.
 *       Realtime updates are sent via Socket.IO when new notifications arrive.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of read notifications
 *       401:
 *         description: Unauthorized
 */
notificationsControllor.get(
  "/",
  verifyToken,
  NotificationsServices.allReadNotifications
);

/**
 * @swagger
 * /notifications/delete:
 *   delete:
 *     summary: Delete notifications
 *     description: |
 *       Deletes notifications for the logged-in user.
 *       Realtime updates will be sent via Socket.IO to update the client immediately.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications deleted successfully
 *       401:
 *         description: Unauthorized
 */
notificationsControllor.delete(
  "/delete",
  verifyToken,
  NotificationsServices.delete_Notifications
);

export { notificationsControllor };
