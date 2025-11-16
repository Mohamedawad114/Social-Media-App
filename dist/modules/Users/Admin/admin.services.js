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
const mongoose_1 = __importDefault(require("mongoose"));
const repositories_1 = require("../../../repositories");
const models_1 = require("../../../DB/models");
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const Errors_1 = require("../../../common/Errors");
class AdminServices {
    constructor() {
        this.userRepo = new repositories_1.UserRepo(models_1.UserModel);
        this.postRepo = new repositories_1.Post_Repo(models_1.postModel);
        this.commentRepo = new repositories_1.commentRepo(models_1.CommentModel);
        this.s3Client = new utils_1.s3_services();
        this.dashboard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield Promise.allSettled([
                this.userRepo.findDocuments({}),
                this.postRepo.findDocuments({}),
            ]);
            return res
                .status(200)
                .json((0, utils_2.SuccessResponse)("users and posts", 200, { result }));
        });
        this.deleteUserAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const session = yield mongoose_1.default.startSession();
            req.session = session;
            session.startTransaction();
            const deleted = yield this.userRepo.findByIdAndDeleteDocument(userId, {
                session,
            });
            yield this.postRepo.deleteManyDocuments({ userId }, { session });
            yield this.commentRepo.deleteManyDocuments({ userId }, { session });
            yield session.commitTransaction();
            session.endSession();
            yield this.s3Client.deleteListderictory(userId.toString());
            return res
                .status(200)
                .json((0, utils_2.SuccessResponse)("account deleted", 200, { deleted }));
        });
        this.strictFreezeUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const user = yield this.userRepo.findByIdDocument(userId);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            user.isFreezed = true;
            const updatedUser = yield this.userRepo.updateUser(user);
            utils_1.emailQueue.add("sendEmail", {
                to: user === null || user === void 0 ? void 0 : user.email,
                type: "freezeAccount",
            });
            return res
                .status(200)
                .json((0, utils_2.SuccessResponse)("user freezed", 200, { updatedUser }));
        });
        this.FreezeUser_peroid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const user = yield this.userRepo.findByIdDocument(userId);
            if (!user)
                throw new Errors_1.notFoundException("user not found");
            yield utils_1.redis.set(`freeze:${userId}`, "true", "EX", 60 * 60 * 24 * 7);
            return res.status(200).json((0, utils_2.SuccessResponse)("user freezed for week", 200));
        });
    }
}
exports.default = new AdminServices();
