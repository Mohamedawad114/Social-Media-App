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
const models_1 = require("../../../DB/models");
const repositories_1 = require("../../../repositories");
const utils_1 = require("../../../utils");
const mongoose_1 = __importDefault(require("mongoose"));
const Errors_1 = require("../../../common/Errors");
const common_1 = require("../../../common");
class Comment_services {
    constructor() {
        this.s3Client = new utils_1.s3_services();
        this.commentRepo = new repositories_1.commentRepo(models_1.CommentModel);
        this.notificationRepo = new repositories_1.NotificationRepo(models_1.NotifiactionModel);
        this.postRepo = new repositories_1.Post_Repo(models_1.postModel);
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const postId = req.params.postId;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            const offset = (page - 1) * limit;
            const post = yield this.postRepo.findByIdDocument(postId);
            if (!post)
                throw new Errors_1.notFoundException("post not found");
            const comments = yield this.commentRepo.findDocuments({ postId, parentId: { $exists: false }, userId: { $nin: blacklist } }, { reactions: 0 }, {
                populate: [{ path: "userId", select: "username " }],
                limit: limit,
                skip: offset,
                sort: { createdAt: -1 },
            });
            if (!comments.length) {
                return res.status(200).json((0, utils_1.SuccessResponse)("no comments yet", 200));
            }
            return res.status(200).json((0, utils_1.SuccessResponse)("comments found", 200, {
                comments,
                page,
            }));
        });
        this.getComments_reply = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const commentId = req.params
                .commentId;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            const offset = (page - 1) * limit;
            const comment = yield this.commentRepo.findByIdDocument(commentId);
            if (!comment)
                throw new Errors_1.notFoundException("comment not found");
            const replies = yield this.commentRepo.findDocuments({ parentId: commentId, userId: { $nin: blacklist } }, { reactions: 0, postId: 0 }, {
                populate: [{ path: "userId", select: "username " }],
                limit: limit,
                skip: offset,
                sort: { createdAt: -1 },
            });
            if (!replies.length) {
                return res.status(200).json((0, utils_1.SuccessResponse)("no replies yet", 200));
            }
            return res.status(200).json((0, utils_1.SuccessResponse)("replies found", 200, {
                replies,
                page,
            }));
        });
        this.getComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const commentId = req.params
                .commentId;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const comment = yield this.commentRepo.findOneDocument({ _id: commentId, userId: { $nin: blacklist } }, { parentId: 0 }, { populate: [{ path: "userId", select: "username " }] });
            if (!comment)
                throw new Errors_1.notFoundException("comment not found");
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("comment found", 200, { comment }));
        });
        this.createComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const postId = req.params.postId;
            const file = req.file;
            const commentDTO = req.body;
            let uploadResult = "";
            const post = yield this.postRepo.findByIdDocument(postId);
            if (!post)
                throw new Errors_1.notFoundException("post not found");
            if (!file && !commentDTO.content && !commentDTO.mention)
                throw new Errors_1.BadRequestException("content Or file are required");
            if (file) {
                const { Key } = yield this.s3Client.upload_file(file, `${userId}/comments/${Date.now()}`);
                uploadResult = Key;
            }
            const created = yield this.commentRepo.createDocument({
                postId: postId,
                userId,
                attachment: uploadResult,
                content: commentDTO.content,
                mentions: commentDTO.mention,
            });
            post.commentCount = Number(post.commentCount) + 1;
            yield this.postRepo.updatePost(post);
            const { title, content } = (0, common_1.notificationHandler)("comment_post", {
                username: `${(_b = req.user) === null || _b === void 0 ? void 0 : _b.username}`,
                commentSnippet: ((_c = created.content) === null || _c === void 0 ? void 0 : _c.substring(0, 20)) || "attachment",
            });
            const notification = yield this.notificationRepo.createDocument({
                userId: post.userId,
                title,
                content,
            });
            yield (0, common_1.sendNotificationsToUser)(post.userId, notification, "comment_post");
            return res
                .status(201)
                .json((0, utils_1.SuccessResponse)("comment created", 201, { created }));
        });
        this.createReply = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const parentId = req.params.commentId;
            const file = req.file;
            const replyDTO = req.body;
            if (!file && !replyDTO.content)
                throw new Errors_1.BadRequestException("content or file are required");
            const parentComment = yield this.commentRepo.findByIdDocument(parentId);
            if (!parentComment)
                throw new Errors_1.notFoundException("Parent comment not found");
            let attachment = "";
            if (file) {
                const { Key } = yield this.s3Client.upload_file(file, `${userId}/replies`);
                attachment = Key;
            }
            const created = yield this.commentRepo.createDocument({
                postId: parentComment.postId,
                userId,
                parentId,
                content: replyDTO.content || null,
                attachment,
                mentions: replyDTO.mention || [],
            });
            const post = yield this.postRepo.findByIdDocument(parentComment.postId);
            if (!post)
                throw new Errors_1.notFoundException("post not found");
            post.commentCount = Number(post.commentCount) + 1;
            yield this.postRepo.updatePost(post);
            const { title, content } = (0, common_1.notificationHandler)("reply_comment", {
                username: `${(_b = req.user) === null || _b === void 0 ? void 0 : _b.username}`,
                commentSnippet: ((_c = created.content) === null || _c === void 0 ? void 0 : _c.substring(0, 20)) || "attachment",
            });
            const notification = yield this.notificationRepo.createDocument({
                userId: parentComment.userId,
                title,
                content,
            });
            yield (0, common_1.sendNotificationsToUser)(post.userId, notification, "reply_comment");
            return res
                .status(201)
                .json((0, utils_1.SuccessResponse)("Reply shared", 201, { created }));
        });
        this.updateComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const commentId = req.params
                .commentId;
            const commentDTO = req.body;
            const comment = yield this.commentRepo.findOneDocument({
                _id: commentId,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            });
            if (!comment)
                throw new Errors_1.notFoundException("comment not found ");
            const commentupdated = yield this.commentRepo.updateDocument({ _id: commentId }, { content: commentDTO.content, mentions: commentDTO.mention }, { new: true });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("comment updated", 200, { commentupdated }));
        });
        this.Reaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const commentId = req.params
                .commentId;
            const { reaction } = req.body;
            const comment = yield this.commentRepo.findByIdDocument(commentId);
            if (!comment)
                throw new Errors_1.notFoundException("comment not found");
            const existing = (_b = comment.reactions) === null || _b === void 0 ? void 0 : _b.find((r) => r.userId.toString() === userId.toString());
            if (existing) {
                if (existing.Reaction === reaction) {
                    yield this.commentRepo.updateDocument({ _id: commentId }, {
                        $pull: { reactions: { userId } },
                        $inc: { reactionsCount: -1 },
                    });
                }
                else {
                    yield this.commentRepo.updateDocument({ _id: commentId, "reactions.userId": userId }, {
                        $set: { "reactions.$.Reaction": reaction },
                    });
                }
            }
            else {
                yield this.commentRepo.updateDocument({ _id: commentId }, {
                    $push: { reactions: { userId, Reaction: reaction } },
                    $inc: { reactionsCount: 1 },
                });
                const { title, content } = (0, common_1.notificationHandler)("like_comment", {
                    username: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.username}`,
                });
                const notification = yield this.notificationRepo.createDocument({
                    userId: comment.userId,
                    title,
                    content,
                });
                yield (0, common_1.sendNotificationsToUser)(comment.userId, notification, "like_comment");
            }
            return res.sendStatus(204);
        });
        this.getReactionsUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const commentId = req.params
                .commentId;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const comment = yield this.commentRepo.findByIdDocument(commentId, { reactions: 1 }, {
                populate: { path: "reactions.userId", select: "username" },
            });
            if (!comment)
                throw new Errors_1.notFoundException("comment not found");
            let Reactions = comment.reactions;
            if (Reactions === null || Reactions === void 0 ? void 0 : Reactions.length) {
                if (blacklist.length) {
                    Reactions = Reactions.filter((r) => !blacklist.includes(r.userId.toString()));
                }
            }
            if (!(Reactions === null || Reactions === void 0 ? void 0 : Reactions.length))
                return res.status(200).json((0, utils_1.SuccessResponse)("no reactions yet", 200));
            return res.status(200).json((0, utils_1.SuccessResponse)("reactions found", 200, {
                Reactions,
            }));
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const commentId = req.params
                .commentId;
            const session = yield mongoose_1.default.startSession();
            req.session = session;
            const comment = yield this.commentRepo.findOneDocument({
                _id: commentId,
            });
            if (!comment)
                throw new Errors_1.notFoundException("comment not found");
            const post = yield this.postRepo.findByIdDocument(comment === null || comment === void 0 ? void 0 : comment.postId);
            if (comment.userId.toString() !== userId.toString() &&
                (post === null || post === void 0 ? void 0 : post.userId.toString()) !== userId.toString()) {
                throw new Errors_1.notAuthorizedException("not authorized to delete this comment");
            }
            session.startTransaction();
            const deleted = yield this.commentRepo.deleteDocument({ _id: commentId }, { session });
            yield this.commentRepo.deleteDocument({ parentId: commentId }, { session });
            yield session.commitTransaction();
            session.endSession();
            if (comment.attachment) {
                yield this.s3Client.deleteFile(comment.attachment);
            }
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("comment deleted", 200, { deleted }));
        });
    }
}
exports.default = new Comment_services();
