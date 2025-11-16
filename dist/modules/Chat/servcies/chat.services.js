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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat_Services = void 0;
const repositories_1 = require("../../../repositories");
const socket_getway_1 = require("../../../Getways/socket.getway");
const mongoose_1 = __importDefault(require("mongoose"));
class Chat_Services {
    constructor() {
        this.conversationRepo = new repositories_1.conversation_Repo();
        this.messageRepo = new repositories_1.Message_Repo();
    }
    joinPrivateChat(socket, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let conversation = yield this.conversationRepo.findOneDocument({
                members: { $all: [socket.data.userId, targetUserId] },
                type: "direct",
            });
            if (!conversation) {
                conversation = yield this.conversationRepo.createDocument({
                    type: "direct",
                    members: [socket.data.userId, targetUserId],
                });
            }
            if (conversation._id)
                socket.join((_a = conversation._id) === null || _a === void 0 ? void 0 : _a.toString());
            return conversation;
        });
    }
    sendPrivateMessage(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { text, targetUserId } = data;
            if (!text || text.trim().length == 0) {
                socket.emit("error message is empty");
                return;
            }
            if (text.trim().length > 1000) {
                socket.emit("error message is veru long");
                return;
            }
            const conversation = yield this.joinPrivateChat(socket, targetUserId);
            const message = yield this.messageRepo.createDocument({
                text: text,
                senderId: socket.data.userId,
                conversationId: conversation._id,
            });
            (0, socket_getway_1.getIo)()
                .to((_a = conversation._id) === null || _a === void 0 ? void 0 : _a.toString())
                .emit("message-send", message);
        });
    }
    getHistory(socket, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.joinPrivateChat(socket, targetUserId);
            const messages = yield this.messageRepo.findDocuments({
                conversationId: conversation._id,
            });
            socket.emit("chat-history", { chat: messages, targetUserId });
        });
    }
    joinGroupChat(socket, targetGroupId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let conversation = yield this.conversationRepo.findOneDocument({
                _id: new mongoose_1.default.Types.ObjectId(targetGroupId),
                type: "group",
            });
            if (conversation === null || conversation === void 0 ? void 0 : conversation._id)
                socket.join((_a = conversation._id) === null || _a === void 0 ? void 0 : _a.toString());
            return conversation;
        });
    }
    sendGroupMessage(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { text, targetGroupId } = data;
            const conversation = yield this.joinGroupChat(socket, targetGroupId);
            const message = yield this.messageRepo.createDocument({
                text: text,
                senderId: socket.data.userId,
                conversationId: conversation === null || conversation === void 0 ? void 0 : conversation._id,
            });
            (0, socket_getway_1.getIo)()
                .to((_a = conversation === null || conversation === void 0 ? void 0 : conversation._id) === null || _a === void 0 ? void 0 : _a.toString())
                .emit("message-send", message);
        });
    }
    getGroupHistory(socket, targetGroupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.joinGroupChat(socket, targetGroupId);
            const messages = yield this.messageRepo.findDocuments({
                conversationId: conversation === null || conversation === void 0 ? void 0 : conversation._id,
            });
            socket.emit("group-chat-history", { chat: messages, targetGroupId });
        });
    }
}
exports.Chat_Services = Chat_Services;
