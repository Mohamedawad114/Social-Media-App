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
exports.ProfileServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../../../utils");
const common_1 = require("../../../common");
const Errors_1 = require("../../../common/Errors");
const repositories_1 = require("../../../repositories");
const models_1 = require("../../../DB/models");
class ProfileServices {
    constructor() {
        this.userRepo = new repositories_1.UserRepo(models_1.UserModel);
        this.s3Client = new utils_1.s3_services();
        this.postRepo = new repositories_1.Post_Repo(models_1.postModel);
        this.commnetRepo = new repositories_1.commentRepo(models_1.CommentModel);
        this.friendshipRepo = new repositories_1.friendshipRepo();
        this.notificationRepo = new repositories_1.NotificationRepo(models_1.NotifiactionModel);
        this.conversationRepo = new repositories_1.conversation_Repo();
        this.profile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const user = yield this.userRepo.findByIdDocument(userId, {
                blockFriends: 0,
            });
            if (!user)
                throw new Errors_1.BadRequestException(`User not found`);
            if (user.phone)
                user.phone = (0, utils_1.decrypt)(user.phone);
            return res.status(200).json((0, utils_1.SuccessResponse)("user profile", 200, { user }));
        });
        this.Updateuser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const updateUser = req.body;
            if (updateUser.email) {
                const valid_email = yield this.userRepo.findOneDocument({
                    email: updateUser.email,
                });
                if (valid_email)
                    throw new Errors_1.conflictException(`email already existed`);
                yield (0, utils_1.createAndSendOTP)(updateUser.email);
                updateUser.isConfirmed = false;
            }
            if (updateUser.phone) {
                updateUser.phone = (0, utils_1.encrypt)(updateUser.phone);
            }
            const updatedUser = yield this.userRepo.findAndUpdateDocument(user === null || user === void 0 ? void 0 : user._id, updateUser);
            if (!updatedUser)
                throw new Errors_1.BadRequestException(`something wrong`);
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("user Updated", 200, { updatedUser }));
        });
        this.updatePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const updatePassword = req.body;
            const user = yield this.userRepo.findByIdDocument(userId, " +password", {
                blockFriends: 0,
            });
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            if (updatePassword.newPassword !== updatePassword.confirmPassword) {
                throw new Errors_1.BadRequestException("confirmPassword must be similar newPassword");
            }
            const isMatch = yield (0, utils_1.compareHash)(updatePassword.oldPassword, user === null || user === void 0 ? void 0 : user.password);
            if (!isMatch)
                throw new Errors_1.BadRequestException(`invalid oldPasword`);
            user.password = updatePassword.confirmPassword;
            yield this.userRepo.updateUser(user);
            const keys = yield utils_1.redis.keys(`refreshToken:${user._id}:*`);
            if (keys.length)
                yield utils_1.redis.del(...keys);
            return res
                .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            })
                .status(200)
                .json((0, utils_1.SuccessResponse)(`password updated`, 200));
        });
        this.resetPasswordreq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            utils_1.emailQueue.add("sendEmail", {
                to: user === null || user === void 0 ? void 0 : user.email,
                type: "resetPassword",
            });
            return res.status(200).json((0, utils_1.SuccessResponse)(`OTP is sent`, 200));
        });
        this.resetPasswordconfrim = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new Errors_1.BadRequestException("User not found");
            const user = req.user;
            const resetPassword = req.body;
            if (!resetPassword.OTP ||
                !resetPassword.newPassword ||
                !resetPassword.confirmPassword)
                throw new Errors_1.BadRequestException(`Both OTP and new passwords are required`);
            const savedOTP = yield utils_1.redis.get(`otp_reset:${user.email}`);
            if (!savedOTP)
                throw new Errors_1.BadRequestException(`expire OTP.`);
            const isMatch = yield (0, utils_1.compareHash)(resetPassword.OTP, savedOTP);
            if (!isMatch)
                throw new Errors_1.BadRequestException(`Invalid OTP`);
            user.password = resetPassword.confirmPassword;
            yield utils_1.redis.del(`otp_reset:${user.email}`);
            yield this.userRepo.updateUser(user);
            const keys = yield utils_1.redis.keys(`refreshToken:${user._id}:*`);
            if (keys.length)
                yield utils_1.redis.del(...keys);
            return res
                .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            })
                .status(200)
                .json((0, utils_1.SuccessResponse)(`password updated`, 200));
        });
        this.uploadProfile_pic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new Errors_1.BadRequestException("User not found");
            const user = req.user;
            const file = req.file;
            if (!file)
                throw new Errors_1.BadRequestException("file is required");
            const { Key } = yield this.s3Client.upload_file(file, `${user === null || user === void 0 ? void 0 : user._id}/profile`);
            user.profilePicture = Key;
            yield this.userRepo.updateUser(user);
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("photo uploaded", 200, { Key }));
        });
        this.uploadCover_pic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new Errors_1.BadRequestException("User not found");
            const user = req.user;
            const file = req.file;
            if (!file)
                throw new Errors_1.BadRequestException("file is required");
            const { Key } = yield this.s3Client.upload_file(file, `${user === null || user === void 0 ? void 0 : user._id}/cover`);
            user.coverPicture = Key;
            yield this.userRepo.updateUser(user);
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("photo uploaded", 200, { Key }));
        });
        this.renew_SignedUrl = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new Errors_1.BadRequestException("User not found");
            const user = req.user;
            const { key, keyType } = req.body;
            if (!key || !keyType)
                throw new Errors_1.BadRequestException("key and keyType required");
            if (user[keyType] !== key)
                throw new Errors_1.BadRequestException("invalid key");
            const url = yield this.s3Client.getSignedUrl(key);
            return res.status(200).json((0, utils_1.SuccessResponse)("photo url", 200, { url }));
        });
        this.sendFreindship = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { friendRequestTo } = req.body;
            const user = yield this.userRepo.findByIdDocument(friendRequestTo);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            const existing = yield utils_1.redis.sismember(`friends:${userId}`, friendRequestTo);
            if (existing)
                throw new Errors_1.BadRequestException("You are already friends");
            if (((_b = user.blockFriends) === null || _b === void 0 ? void 0 : _b.includes(userId)) ||
                (yield this.friendshipRepo.findOneDocument({
                    requestFromId: userId,
                    requestToId: friendRequestTo,
                }))) {
                throw new Errors_1.BadRequestException("can't send friendship");
            }
            const friendshipRequest = yield this.friendshipRepo.createDocument({
                requestFromId: userId,
                requestToId: friendRequestTo,
            });
            const { title, content } = (0, common_1.notificationHandler)("friend_request", {
                username: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.username}`,
            });
            const notification = yield this.notificationRepo.createDocument({
                userId: friendRequestTo,
                title,
                content,
            });
            yield (0, common_1.sendNotificationsToUser)(friendRequestTo, notification, "friend_request");
            return res
                .status(201)
                .json((0, utils_1.SuccessResponse)("request send", 201, { friendshipRequest }));
        });
        this.responseFreindship = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { requestFromId, response } = req.body;
            const friendship = yield this.friendshipRepo.findOneDocument({
                requestFromId,
                requestToId: userId,
                status: common_1.friendshipEnum.pending,
            });
            if (!friendship)
                throw new Errors_1.notFoundException("user not found");
            friendship.status = response;
            const updated = yield this.friendshipRepo.saveUpdate(friendship);
            if (response == common_1.friendshipEnum.accepted) {
                yield utils_1.redis.sadd(`friends:${userId}`, requestFromId);
                yield utils_1.redis.sadd(`friends:${requestFromId}`, userId);
                const { title, content } = (0, common_1.notificationHandler)("friend_response", {
                    username: `${(_b = req.user) === null || _b === void 0 ? void 0 : _b.username}`,
                });
                const notification = yield this.notificationRepo.createDocument({
                    userId: requestFromId,
                    title,
                    content,
                });
                yield (0, common_1.sendNotificationsToUser)(requestFromId, notification, "friend_response");
            }
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("response send", 200, { updated }));
        });
        this.listRequests = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { status } = req.query;
            const filters = { status };
            if (filters.status == common_1.friendshipEnum.accepted) {
                const friends = yield utils_1.redis.smembers(`friends:${userId}`);
                if (friends.length) {
                    const users = yield this.userRepo.findDocuments({ _id: { $in: friends } }, { username: 1, profilePicture: 1 });
                    return res
                        .status(200)
                        .json((0, utils_1.SuccessResponse)("friends from redis", 200, { friends: users }));
                }
            }
            const requests = yield this.friendshipRepo.findDocuments({
                status: status,
                requestToId: userId,
            }, { requestToId: 0 }, {
                populate: [
                    {
                        path: "requestFromId",
                        select: "username profilePicture",
                    },
                ],
            });
            if (!requests.length)
                return res.status(200).json((0, utils_1.SuccessResponse)("no requests found", 200));
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)(" requests ", 200, { requests }));
        });
        this.unfriend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { friendId } = req.body;
            const friendship = yield this.friendshipRepo.findOneDocument({
                $or: [
                    { requestFromId: userId, requestToId: friendId },
                    { requestFromId: friendId, requestToId: userId },
                ],
                status: common_1.friendshipEnum.accepted,
            });
            if (!friendship)
                throw new Errors_1.notFoundException("friendship not found");
            yield this.friendshipRepo.deleteDocument({ _id: friendship._id });
            yield utils_1.redis.srem(`friends:${userId}`, friendId);
            yield utils_1.redis.srem(`friends:${friendId}`, userId);
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("friend removed successfully", 200));
        });
        this.createGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { name, memberIds } = req.body;
            const members = yield this.userRepo.findDocuments({
                _id: { $in: memberIds },
            });
            if (members.length !== memberIds.length)
                throw new Errors_1.notFoundException("users not found");
            const friends = yield utils_1.redis.smembers(`friends:${userId}`);
            if (friends.length) {
                const result = yield utils_1.redis.smismember(`friends:${userId}`, memberIds);
                const IsAllFriends = result.every((v) => v == 1);
                if (!IsAllFriends)
                    throw new Errors_1.BadRequestException("Some members are not your friends");
            }
            else {
                const IsFriends = yield this.friendshipRepo.findDocuments({
                    $or: [
                        { requestFromId: userId, requestToId: { $in: memberIds } },
                        { requestToId: userId, requestFromId: { $in: memberIds } },
                    ],
                });
                if (IsFriends.length !== memberIds.length) {
                    throw new Errors_1.BadRequestException("Some members are not your friends");
                }
            }
            const Group = yield this.conversationRepo.createDocument({
                name,
                members: [userId, ...memberIds],
                type: common_1.conversation.group,
            });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("group created", 200, { Group }));
        });
        this.listUserGroups = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const groups = yield this.conversationRepo.findDocuments({ members: { $in: userId }, type: common_1.conversation.group }, { name: 1, members: 1, createdAt: 1 });
            if (!groups.length)
                return [];
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("groups found", 200, { groups }));
        });
        this.blockFriend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const user = yield this.userRepo.findByIdDocument(userId);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            const { friendId } = req.body;
            if ((_b = user.blockFriends) === null || _b === void 0 ? void 0 : _b.includes(friendId))
                throw new Errors_1.BadRequestException("user already blocked");
            const isExist = yield this.userRepo.findByIdDocument(friendId);
            if (!isExist)
                throw new Errors_1.notFoundException("user not found");
            (_c = user === null || user === void 0 ? void 0 : user.blockFriends) === null || _c === void 0 ? void 0 : _c.push(friendId);
            yield this.userRepo.updateUser(user);
            if (yield utils_1.redis.sismember(`friends:${user === null || user === void 0 ? void 0 : user._id}`, friendId)) {
                const friendship = yield this.friendshipRepo.findOneDocument({
                    $or: [
                        { requestFromId: userId, requestToId: friendId },
                        { requestFromId: friendId, requestToId: userId },
                    ],
                    status: common_1.friendshipEnum.accepted,
                });
                yield this.friendshipRepo.deleteDocument({ _id: friendship === null || friendship === void 0 ? void 0 : friendship._id });
                yield Promise.all([
                    utils_1.redis.srem(`friends:${userId}`, friendId),
                    utils_1.redis.srem(`friends:${friendId}`, userId),
                ]);
            }
            yield utils_1.redis.sadd(`blocked_friends:${userId}`, friendId);
            return res.status(200).json((0, utils_1.SuccessResponse)("user blocked", 200));
        });
        this.unBlockFriend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const user = yield this.userRepo.findByIdDocument(userId);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            const { friendId } = req.body;
            const isExist = (_b = user.blockFriends) === null || _b === void 0 ? void 0 : _b.includes(friendId);
            if (!isExist)
                throw new Errors_1.notFoundException("user not found in your block list");
            user.blockFriends = (_c = user.blockFriends) === null || _c === void 0 ? void 0 : _c.filter((f) => {
                return f.toString() !== friendId.toString();
            });
            yield this.userRepo.updateUser(user);
            yield utils_1.redis.srem(`blocked_friends:${userId}`, friendId);
            return res.status(200).json((0, utils_1.SuccessResponse)("user  unblocked", 200));
        });
        this.blockFriendsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const user = yield this.userRepo.findByIdDocument(userId);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            let list_redis = yield (0, common_1.friends_Blacklist)(userId);
            let blockedIds = [];
            if (list_redis.length > 0) {
                blockedIds = list_redis;
            }
            else if (user.blockFriends && user.blockFriends.length > 0) {
                blockedIds = user.blockFriends.map((id) => id.toString());
            }
            else {
                return [];
            }
            const blockedUsers = yield this.userRepo.findDocuments({ _id: { $in: blockedIds } }, {
                username: 1,
                profilePicture: 1,
            });
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("users blocked", 200, { blockedUsers }));
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = req.cookies.refreshToken;
            const accessToken = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token)
                return res.sendStatus(204);
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (!err && decoded.jti) {
                    yield utils_1.redis.del(`refreshToken:${decoded.id}:${decoded.jti}`);
                    yield utils_1.redis.set(`tokens_blacklist:${accessToken}`, "0", "EX", 60 * 30);
                }
                return res.clearCookie("refreshToken").sendStatus(204);
            }));
            return;
        });
        this.logoutAllDevices = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.sendStatus(204);
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (!err && decoded.jti) {
                    const keys = yield utils_1.redis.keys(`refreshToken:${decoded.id}:*`);
                    if (keys.length)
                        yield utils_1.redis.del(keys);
                }
                return res.clearCookie("refreshToken").sendStatus(204);
            }));
            return;
        });
        this.deleteAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new Errors_1.BadRequestException("User not found");
            const user = req.user;
            const userId = user._id;
            const session = yield mongoose_1.default.startSession();
            req.session = session;
            session.startTransaction();
            const deleted = yield this.userRepo.findByIdAndDeleteDocument(user._id, { session });
            yield this.postRepo.deleteManyDocuments({ userId }, { session });
            yield this.commnetRepo.deleteManyDocuments({ userId }, { session });
            yield session.commitTransaction();
            session.endSession();
            yield this.s3Client.deleteListderictory(userId.toString());
            return res
                .status(200)
                .json((0, utils_1.SuccessResponse)("account deleted", 200, { deleted }));
        });
        //graphQl
        this.profileInfo = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByIdDocument(userId, {
                blockFriends: 0,
            });
            if (!user)
                throw new Errors_1.BadRequestException(`User not found`);
            if (user.phone)
                user.phone = (0, utils_1.decrypt)(user.phone);
            return user;
        });
        this.blockFriends = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByIdDocument(userId);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            let list_redis = yield (0, common_1.friends_Blacklist)(userId);
            let blockedIds = [];
            if (list_redis.length > 0) {
                blockedIds = list_redis;
            }
            else if (user.blockFriends && user.blockFriends.length > 0) {
                blockedIds = user.blockFriends.map((id) => id.toString());
            }
            else {
                return [];
            }
            const blockedUsers = yield this.userRepo.findDocuments({ _id: { $in: blockedIds } }, {
                blockFriends: 0,
            });
            return blockedUsers;
        });
        this.Requests = (userId, status) => __awaiter(this, void 0, void 0, function* () {
            if (status == common_1.friendshipEnum.accepted) {
                const friends = yield utils_1.redis.smembers(`friends:${userId}`);
                if (friends.length) {
                    const users = yield this.userRepo.findDocuments({ _id: { $in: friends } }, { username: 1, profilePicture: 1 });
                    return users;
                }
            }
            const requests = yield this.friendshipRepo.findDocuments({
                status: status,
                requestToId: userId,
            }, { requestToId: 0 }, {
                populate: [
                    {
                        path: "requestFromId",
                        select: "username profilePicture coverPicture",
                    },
                ],
            });
            if (!requests.length)
                return "not found requests";
            console.log({ userId, status, requests });
            return requests;
        });
    }
    resendOTP_reset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            utils_1.emailQueue.add("sendEmail", {
                to: user === null || user === void 0 ? void 0 : user.email,
                type: "resetPassword",
            });
            return res.status(200).json((0, utils_1.SuccessResponse)(`OTP sent`, 200));
        });
    }
}
exports.ProfileServices = ProfileServices;
exports.default = new ProfileServices();
