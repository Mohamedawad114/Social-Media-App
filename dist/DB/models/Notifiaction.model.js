"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifiactionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notifiactionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
const NotifiactionModel = mongoose_1.default.model('Notification', notifiactionSchema);
exports.NotifiactionModel = NotifiactionModel;
