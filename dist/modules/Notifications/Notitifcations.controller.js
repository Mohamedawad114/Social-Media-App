"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsControllor = void 0;
const express_1 = require("express");
const Notifications_services_1 = __importDefault(require("./Notifications.services"));
const middlwares_1 = require("../../middlwares");
const notificationsControllor = (0, express_1.Router)({ mergeParams: true });
exports.notificationsControllor = notificationsControllor;
notificationsControllor.get("/nuRead-notifications", middlwares_1.verifyToken, Notifications_services_1.default.unReadNotifications);
notificationsControllor.get("/", middlwares_1.verifyToken, Notifications_services_1.default.allReadNotifications);
notificationsControllor.delete("/delete", middlwares_1.verifyToken, Notifications_services_1.default.delete_Notifications);
