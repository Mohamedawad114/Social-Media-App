"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendshipModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const friendshipSchema = new mongoose_1.default.Schema({
    requestFromId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    requestToId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: common_1.friendshipEnum,
        default: common_1.friendshipEnum.pending
    }
});
const friendshipModel = mongoose_1.default.model("Friendship", friendshipSchema);
exports.friendshipModel = friendshipModel;
