"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = exports.ReactionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
exports.ReactionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Reaction: {
        type: Number,
        enum: common_1.Post_Reaction,
        required: true,
    },
}, {
    timestamps: true,
});
const PostSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Reactions: [exports.ReactionSchema],
    attachments: [{ type: String }],
    content: {
        type: String,
        required() {
            return (!this.attachments ||
                (this.attachments.length === 0 && !this.sharedFrom));
        },
        trim: true,
    },
    reactionCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    sharedCount: { type: Number, default: 0 },
    sharedFrom: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
}, {
    timestamps: true,
});
const postModel = mongoose_1.default.model("Post", PostSchema);
exports.postModel = postModel;
