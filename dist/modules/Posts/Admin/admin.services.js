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
const models_1 = require("../../../DB/models");
const repositories_1 = require("../../../repositories");
const Errors_1 = require("../../../common/Errors");
class AdminPostServices {
    constructor() {
        this.postRepo = new repositories_1.Post_Repo(models_1.postModel);
        this.deletepost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            const deletedPost = yield this.postRepo.findByIdAndDeleteDocument(postId);
            if (deletedPost)
                throw new Errors_1.notFoundException("post not found or already deleted");
            return res
                .status(200)
                .json({ message: "post deleted successfully", deletedPost });
        });
    }
}
exports.default = new AdminPostServices();
