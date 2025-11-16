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
exports.isBlock = exports.friends_Blacklist = void 0;
const utils_1 = require("../../utils");
const friends_Blacklist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const balckList = yield utils_1.redis.smembers(`blocked_friends:${userId}`);
    return balckList || [];
});
exports.friends_Blacklist = friends_Blacklist;
const isBlock = (userId, checkId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield utils_1.redis.sismember(`blocked_friends:${userId}`, checkId);
});
exports.isBlock = isBlock;
