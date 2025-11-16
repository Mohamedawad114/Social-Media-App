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
exports.IsOwner = IsOwner;
const models_1 = require("../DB/models");
const Errors_1 = require("../common/Errors");
function IsOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const postId = req.params.postId;
        const post = yield models_1.postModel.findById(postId);
        if (!post)
            throw new Errors_1.notFoundException("post not found");
        if (post.userId.toString() !== userId.toString()) {
            throw new Errors_1.notAuthorizedException("you 're not authorized");
        }
        next();
    });
}
