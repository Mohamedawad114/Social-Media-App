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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const profile_services_1 = require("./services/profile.services");
class UserResolver {
    constructor() {
        this.userServices = new profile_services_1.ProfileServices();
        this.profileInfo = (parent, args, context) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = context.User) === null || _a === void 0 ? void 0 : _a._id;
            return yield this.userServices.profileInfo(userId);
        });
        this.blockedUser = (parent, args, context) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = context.User) === null || _a === void 0 ? void 0 : _a._id;
            return yield this.userServices.blockFriends(userId);
        });
        this.requests = (parent, args, context) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = context.User) === null || _a === void 0 ? void 0 : _a._id;
            return yield this.userServices.Requests(userId, args.status);
        });
    }
}
exports.UserResolver = UserResolver;
