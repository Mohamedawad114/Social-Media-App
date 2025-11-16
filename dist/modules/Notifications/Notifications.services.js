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
exports.NotificationsServices = void 0;
const models_1 = require("../../DB/models");
const repositories_1 = require("../../repositories");
const utils_1 = require("../../utils");
class NotificationsServices {
    constructor() {
        this.notificationRepo = new repositories_1.NotificationRepo(models_1.NotifiactionModel);
        this.unReadNotifications = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const limit = 5;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const notifications = yield this.notificationRepo.findDocuments({ userId, isRead: false }, { userId: 0, isRead: 0 }, { lean: true, limit, skip, sort: { createdAt: -1 } });
            const notificationsCount = yield this.notificationRepo.countDocuments({ userId, isRead: false });
            const pages = Math.ceil(notificationsCount / limit);
            yield this.notificationRepo.updateManyDocuments({ userId, isRead: false }, { isRead: true });
            if (notifications.length)
                return res
                    .status(200)
                    .json((0, utils_1.SuccessResponse)("unRead notifications", 200, { notifications, notificationsCount, pages }));
            return res.status(200).json({ message: "no unRead notifications yet" });
        });
        this.allReadNotifications = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const limit = 8;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const notifications = yield this.notificationRepo.findDocuments({ userId, isRead: true }, { userId: 0 }, { lean: true, limit, skip, sort: { createdAt: -1 } });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("Read notifications", 200, { notifications }));
        });
        this.delete_Notifications = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const notifications = yield this.notificationRepo.deleteManyDocuments({ userId, isRead: true });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)(" notifications deleted", 200, { notifications }));
        });
    }
}
exports.NotificationsServices = NotificationsServices;
exports.default = new NotificationsServices();
