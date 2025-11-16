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
exports.friendshipRepo = void 0;
const models_1 = require("../DB/models");
const Base_repository_1 = require("./Base.repository");
class friendshipRepo extends Base_repository_1.BaseRepository {
    constructor() {
        super(models_1.friendshipModel);
    }
    saveUpdate(friendship) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield friendship.save();
        });
    }
}
exports.friendshipRepo = friendshipRepo;
