"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const utils_1 = require("../../utils");
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        minlength: [4, "user_name length must great than 4 "],
        required: true,
    },
    DOB: {
        type: Date,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: function () {
            return this.provider == common_1.Provider.local;
        },
    },
    role: {
        type: String,
        enum: common_1.Sys_Role,
        default: common_1.Sys_Role.user,
        select: false
    },
    password: {
        type: String,
        required: function () {
            return this.provider == common_1.Provider.local;
        },
        select: false,
    },
    subId: {
        type: Number,
        select: false,
    },
    provider: {
        type: String,
        required: true,
        enum: common_1.Provider,
        default: common_1.Provider.local,
        select: false,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    coverPicture: {
        type: String,
        default: null,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
        select: false
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String,
        enum: common_1.Gender,
    },
    blockFriends: [{
            type: String,
            default: null,
        }],
    isFreezed: {
        type: Boolean,
        default: false,
        select: false,
    },
}, {
    timestamps: true,
});
UserSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = (0, utils_1.generatehHash)(this.password);
    }
});
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.UserModel = UserModel;
