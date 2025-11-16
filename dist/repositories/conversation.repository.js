"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversation_Repo = void 0;
const models_1 = require("../DB/models");
const Base_repository_1 = require("./Base.repository");
class conversation_Repo extends Base_repository_1.BaseRepository {
    constructor() {
        super(models_1.conversationModel);
    }
}
exports.conversation_Repo = conversation_Repo;
