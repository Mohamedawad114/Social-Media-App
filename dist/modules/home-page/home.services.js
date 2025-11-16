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
const dayjs_1 = __importDefault(require("dayjs"));
const models_1 = require("../../DB/models");
const repositories_1 = require("../../repositories");
const utils_1 = require("../../utils");
const Errors_1 = require("../../common/Errors");
const common_1 = require("../../common");
class Home_Services {
    constructor() {
        this.userRepo = new repositories_1.UserRepo(models_1.UserModel);
        this.postRepo = new repositories_1.Post_Repo(models_1.postModel);
        this.friendshipRepo = new repositories_1.friendshipRepo();
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const username = req.query.name;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const page = parseInt(req.query.page) || 1;
            const limit = 8;
            const offset = (page - 1) * limit;
            if (!(username === null || username === void 0 ? void 0 : username.trim()))
                return res
                    .status(400)
                    .json((0, utils_1.SuccessResponse)("username query is required", 400));
            const users = yield this.userRepo.findDocuments({ username: { $regex: `${username}`, $options: "i" }, _id: { $nin: blacklist } }, {
                phone: 0,
                email: 0,
                blockFriends: 0
            }, {
                limit: limit,
                skip: offset,
            });
            if (!users.length)
                return res.status(200).json((0, utils_1.SuccessResponse)("no users found ", 200));
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("users found ", 200, { users, page }));
        });
        this.getUserPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.params.userId;
            const blacklist = yield (0, common_1.friends_Blacklist)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            const user = yield this.userRepo.findOneDocument({ $and: [{ _id: userId }, { _id: { $nin: blacklist } }] });
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            if (!user.isPublic) {
                return res
                    .status(200)
                    .json((0, utils_1.SuccessResponse)("user profile is private", 200));
            }
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            const offset = (page - 1) * limit;
            const userPosts = yield this.postRepo.findDocuments({ userId }, {
                Reactions: 0,
            }, {
                limit: limit,
                skip: offset,
                sort: { createdAt: -1 },
            });
            if (!userPosts.length)
                throw new Errors_1.notFoundException("no posts found");
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("posts found", 200, { userPosts, page }));
        });
        this.getFeedsPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const page = parseInt(req.query.page) || 1;
            const start = (0, dayjs_1.default)().subtract(1, "day").startOf("day").toDate();
            const limit = 10;
            const offset = (page - 1) * limit;
            let friends = yield utils_1.redis.smembers(`friends:${userId}`);
            if (!friends.length) {
                const friendships = yield this.friendshipRepo.findDocuments({
                    $or: [{ requestFromId: userId }, { requestToId: userId }],
                    status: "accepted",
                }, { requester: 1, requestTo: 1 });
                const ids = new Set();
                for (const f of friendships) {
                    if (String(f.requestFromId) !== String(userId))
                        ids.add(String(f.requestFromId));
                    if (String(f.requestToId) !== String(userId))
                        ids.add(String(f.requestToId));
                }
                friends = Array.from(ids);
            }
            const posts = yield this.postRepo.findDocuments({
                userId: { $in: friends },
                createdAt: { $gte: start },
            }, { Reactions: 0 }, {
                populate: { path: "userId", select: "username profilePicture" },
                limit,
                skip: offset,
                sort: { createdAt: -1 },
            });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("friends posts", 200, { posts }));
        });
    }
}
exports.default = new Home_Services();
