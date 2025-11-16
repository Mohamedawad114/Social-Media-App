"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationsToUser = sendNotificationsToUser;
const socket_getway_1 = require("../../Getways/socket.getway");
const middlwares_1 = require("../../middlwares");
const utils_1 = require("../../utils");
function sendNotificationsToUser(sendTo, notification, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const io = (0, socket_getway_1.getIo)();
            const userSockets = (yield utils_1.redis.smembers(`user_sockets:${sendTo}`)) || [];
            userSockets.forEach((socketId) => {
                io.to(socketId).emit("notification", {
                    title: notification.title,
                    content: notification.content,
                    type: type,
                    notificationId: notification._id,
                });
            });
        }
        catch (err) {
            middlwares_1.logger.error(`Socket emit failed: err`);
        }
    });
}
