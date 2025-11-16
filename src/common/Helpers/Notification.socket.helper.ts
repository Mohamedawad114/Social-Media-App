import {  getIo } from "../../Getways/socket.getway";
import { logger } from "../../middlwares";
import { redis } from "../../utils";


async function sendNotificationsToUser(
  sendTo: string,
  notification: any,
  type:string
) {
  try {
    const io = getIo();
    const userSockets =await redis.smembers(`user_sockets:${sendTo}`) || [];
    userSockets.forEach((socketId) => {
      io.to(socketId).emit("notification", {
        title:notification.title,
        content: notification.content,
        type: type,
        notificationId: notification._id,
      });
    });
  } catch (err) {
    logger.error(`Socket emit failed: err`);
  }
}
export { sendNotificationsToUser }