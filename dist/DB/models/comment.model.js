"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Post_model_1 = require("./Post.model");
const commentSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required() {
            const hasAttachment = this.attachment && String(this.attachment).trim().length > 0;
            const hasMentions = this.mentions && this.mentions.length > 0;
            return !hasAttachment && !hasMentions;
        },
        trim: true,
    },
    attachment: {
        type: String,
    },
    reactionsCount: {
        type: Number,
        default: 0,
    },
    reactions: [Post_model_1.ReactionSchema],
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
    },
    mentions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
}, {
    timestamps: true,
});
const CommentModel = mongoose_1.default.model("Comment", commentSchema);
exports.CommentModel = CommentModel;
