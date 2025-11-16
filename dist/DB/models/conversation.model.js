"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const conversationchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        default: common_1.conversation.direct,
        enum: common_1.conversation,
    },
    name: String,
    members: [
        {
            type: String,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
});
const conversationModel = mongoose_1.default.model("Conversation", conversationchema);
exports.conversationModel = conversationModel;
