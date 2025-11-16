"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message_Repo = void 0;
const models_1 = require("../DB/models");
const Base_repository_1 = require("./Base.repository");
class Message_Repo extends Base_repository_1.BaseRepository {
    constructor() {
        super(models_1.messageModel);
    }
}
exports.Message_Repo = Message_Repo;
