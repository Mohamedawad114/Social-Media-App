"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    conversationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Conversation",
    },
    attachment: [String],
}, {
    timestamps: true,
});
const messageModel = mongoose_1.default.model("Message", messageSchema);
exports.messageModel = messageModel;
