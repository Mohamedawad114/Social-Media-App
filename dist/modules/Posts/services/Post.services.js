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
exports.Post_services = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repositories_1 = require("../../../repositories");
const models_1 = require("../../../DB/models");
const utils_1 = require("../../../utils");
const Errors_1 = require("../../../common/Errors");
const common_1 = require("../../../common");
class Post_services {
    constructor() {
        this.postRepo = new repositories_1.Post_Repo(models_1.postModel);
        this.notificationRepo = new repositories_1.NotificationRepo(models_1.NotifiactionModel);
        this.commentRepo = new repositories_1.commentRepo(models_1.CommentModel);
        this.s3Client = new utils_1.s3_services();
        this.getMyPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            const offset = (page - 1) * limit;
            const myposts = yield this.postRepo.findDocuments({ userId }, {
                Reactions: 0,
                sharedFrom: 0,
            }, {
                limit: limit,
                skip: offset,
                sort: { createdAt: -1 },
            });
            if (!myposts.length)
                throw new Errors_1.notFoundException("posts not found");
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("posts found", 200, { myposts, page }));
        });
        this.getPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const postId = req.params.postId;
            const blacklist = yield utils_1.redis.smembers(`blocked_friends:${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}`);
            const post = yield this.postRepo.findOneDocument({
                _id: postId,
                userId: { $nin: blacklist },
            }, {
                Reactions: 0,
                sharedFrom: 0,
            }, {
                populate: {
                    path: "userId",
                    select: "username",
                },
            });
            if (!post) {
                throw new Errors_1.notFoundException("post not found");
            }
            return res.status(200).json((0, utils_1.SuccessResponse)("post found", 200, { post }));
        });
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const content = req.body.content;
            const files = req.files;
            const createdPost = yield this.postRepo.createDocument({
                userId,
                content,
            });
            let uploadResult = [];
            if (files && files.length > 0) {
                uploadResult = yield this.s3Client.upload_files(files, `${userId}/posts/${createdPost._id}`);
                createdPost.attachments = uploadResult;
                yield this.postRepo.updatePost(createdPost);
            }
            return res
                .status(201)
                .json((0, utils_1.SuccessResponse)("post shared", 201, { createdPost }));
        });
        this.sharePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const postId = req.params.postId;
            const { content = "" } = req.body || {};
            const post = yield this.postRepo.findByIdDocument(postId);
            if (!post)
                throw new Errors_1.notFoundException("original post not found");
            const sharedPost = yield this.postRepo.createDocument({
                userId,
                content,
                sharedFrom: postId,
            });
            post.sharedCount = Number(post.sharedCount) + 1;
            yield this.postRepo.updatePost(post);
            return res
                .status(201)
                .json((0, utils_1.SuccessResponse)("post shared", 201, { sharedPost }));
        });
        this.updatePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            const { content } = req.body;
            if (!postId)
                throw new Errors_1.BadRequestException("postId is required");
            const postUpdated = yield this.postRepo.findAndUpdateDocument(postId, {
                content: content,
            });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("post updated", 200, { postUpdated }));
        });
        this.Reaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const postId = req.params.postId;
            const { reaction } = req.body;
            const post = yield this.postRepo.findByIdDocument(postId);
            if (!post)
                throw new Errors_1.notFoundException("post not found");
            const existing = (_b = post.Reactions) === null || _b === void 0 ? void 0 : _b.find((r) => r.userId.toString() === userId.toString());
            if (existing) {
                if (existing.Reaction === reaction) {
                    yield this.postRepo.updateDocument({ _id: postId }, {
                        $pull: { Reactions: { userId } },
                        $inc: { reactionCount: -1 },
                    });
                }
                else {
                    yield this.postRepo.updateDocument({ _id: postId, "Reactions.userId": userId }, {
                        $set: { "Reactions.$.Reaction": reaction },
                    });
                }
            }
            else {
                yield this.postRepo.updateDocument({ _id: postId }, {
                    $push: { Reactions: { userId, Reaction: reaction } },
                    $inc: { reactionCount: 1 },
                });
                const { title, content } = (0, common_1.notificationHandler)("like_post", {
                    username: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.username}`,
                });
                const notification = yield this.notificationRepo.createDocument({
                    userId: post.userId,
                    title,
                    content,
                });
                yield (0, common_1.sendNotificationsToUser)(post.userId, notification, "like_post");
            }
            return res.sendStatus(204);
        });
        this.getReactionsUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const postId = req.params.postId;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const post = yield this.postRepo.findByIdDocument(postId, { Reactions: 1 }, {
                populate: { path: "Reactions.userId", select: "username" },
            });
            if (!post)
                throw new Errors_1.notFoundException("post not found");
            let reactions = post.Reactions;
            if (reactions === null || reactions === void 0 ? void 0 : reactions.length) {
                if (blacklist.length) {
                    reactions = reactions.filter((r) => !blacklist.includes(r.userId.toString()));
                }
            }
            if (!(reactions === null || reactions === void 0 ? void 0 : reactions.length))
                return res.status(200).json((0, utils_1.SuccessResponse)("no reactions yet", 200));
            return res.status(200).json((0, utils_1.SuccessResponse)("reactions found", 200, {
                reactions,
            }));
        });
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const postId = req.params.postId;
            const post = yield this.postRepo.findByIdDocument(postId);
            if (!post)
                throw new Errors_1.notFoundException("post not found");
            const session = yield mongoose_1.default.startSession();
            req.session = session;
            session.startTransaction();
            const PostDeleted = yield this.postRepo.findByIdAndDeleteDocument(postId, {
                session,
            });
            yield this.commentRepo.deleteManyDocuments({ postId }, { session });
            yield session.commitTransaction();
            session.endSession();
            if ((_b = post.attachments) === null || _b === void 0 ? void 0 : _b.length) {
                yield this.s3Client.deleteListderictory(`${userId}/posts/${postId}`);
            }
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("post deleted", 200, { PostDeleted }));
        });
        //graph
        this.profilePosts = (userId_1, ...args_1) => __awaiter(this, [userId_1, ...args_1], void 0, function* (userId, page = 1) {
            const limit = 15;
            const offset = (page - 1) * limit;
            const myposts = yield this.postRepo.findDocuments({ userId }, {
                Reactions: 0,
            }, {
                limit: limit,
                skip: offset,
                sort: { createdAt: -1 },
            });
            if (!myposts.length)
                throw new Errors_1.notFoundException("posts not found");
            return myposts;
        });
    }
}
exports.Post_services = Post_services;
exports.default = new Post_services();
