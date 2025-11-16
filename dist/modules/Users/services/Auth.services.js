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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const repositories_1 = require("../../../repositories");
const models_1 = require("../../../DB/models");
const Errors_1 = require("../../../common/Errors");
const utils_1 = require("../../../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../../../common");
class AuthServices {
    constructor() {
        this.userRepo = new repositories_1.UserRepo(models_1.UserModel);
        this.SignUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const signUpDTO = req.body;
            const checkEmail = yield this.userRepo.findOneDocument({
                email: signUpDTO.email,
            });
            if (checkEmail)
                throw new Errors_1.conflictException(`email is already exist`, {});
            const created = yield this.userRepo.createDocument(Object.assign(Object.assign({}, signUpDTO), { phone: (0, utils_1.encrypt)(signUpDTO.phone) }));
            utils_1.emailQueue.add("sendEmail", {
                to: created.email,
                type: "confirmation",
            });
            return res.status(201).json({ message: `user created`, created });
        });
        this.confrim_email = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const confirmDTO = req.body;
            const User = yield this.userRepo.findOneDocument({
                email: confirmDTO.email,
            });
            if (!User)
                throw new Errors_1.notFoundException(`user not found`, {});
            if (!confirmDTO.OTP)
                throw new Errors_1.BadRequestException(`OTP required`, {});
            const savedOTP = yield utils_1.redis.get(`otp_${confirmDTO.email}`);
            if (!savedOTP) {
                throw new Errors_1.BadRequestException(`expire OTP`, {});
            }
            const isMAtch = (0, utils_1.compareHash)(confirmDTO.OTP, savedOTP);
            if (!isMAtch)
                throw new Errors_1.BadRequestException(`invalid OTP`, {});
            User.isConfirmed = true;
            yield utils_1.redis.del(`otp_${confirmDTO.email}`);
            yield User.save();
            return res.status(200).json({ message: `email is confirmed ` });
        });
        this.signWithGoogle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { idToken } = req.body;
            const payload = yield this.verifyloginGoogle(idToken);
            const { name, email, email_verified, sub } = payload;
            if (!email_verified)
                throw new Errors_1.BadRequestException("email not verified");
            const user = yield this.userRepo.findOneDocument({});
            if (user) {
                const accessToken = yield (0, utils_1.generateAccessToken)({
                    id: user === null || user === void 0 ? void 0 : user._id,
                    username: name,
                });
                return res
                    .status(200)
                    .json({ message: "Login successfully", accessToken });
            }
            const createdUser = yield this.userRepo.createDocument({
                username: name,
                email: email,
                isConfirmed: true,
                provider: common_1.Provider.google,
                subId: sub,
            });
            const accessToken = yield (0, utils_1.generateTokens)({
                res,
                id: createdUser._id,
                role: createdUser.role,
            });
            return res.status(201).json({ accessToken });
        });
        this.resendOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const User = yield this.userRepo.findOneDocument({
                email: email,
                isConfirmed: false,
            });
            if (!User)
                throw new Errors_1.notFoundException(`email not found or confimed`, {});
            utils_1.emailQueue.add("sendEmail", {
                to: email,
                type: "confirmation",
            });
            return res.status(200).send(`OTP sent`);
        });
        this.loginuser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield this.userRepo.findOneDocument({
                email: email,
                isFreezed: false,
            }, '+isConfirmed +password');
            if (!user)
                throw new Errors_1.notFoundException(`email not found, or your account freezed`);
            if (!user.isConfirmed) {
                throw new Errors_1.BadRequestException(`email not verified please verify email first`);
            }
            const passMatch = yield (0, utils_1.compareHash)(password, user === null || user === void 0 ? void 0 : user.password);
            if (!passMatch)
                throw new Errors_1.BadRequestException(`invalid Password or email`, {});
            const accessToken = yield (0, utils_1.generateTokens)({
                res: res,
                id: user._id,
                role: user.role,
                username: user.username,
            });
            return res.status(200).json({
                message: `login seccussfully`,
                accessToken,
            });
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.sendStatus(401);
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                console.log("decoded:", decoded);
                if (err) {
                    console.log("errrorrr", err);
                    return res.sendStatus(403);
                }
                const isexisted = yield utils_1.redis.get(`refreshToken:${decoded.id}:${decoded.jti}`);
                if (!isexisted) {
                    return res.sendStatus(403);
                }
                ;
                const accessToken = (0, utils_1.generateAccessToken)({
                    id: decoded.id,
                    role: decoded.role,
                    username: decoded.username,
                });
                return res.json({ accessToken });
            }));
            return;
        });
    }
    verifyloginGoogle(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new google_auth_library_1.OAuth2Client();
            const ticket = yield client.verifyIdToken({
                idToken: idToken,
                audience: process.env.CLIENTID,
            });
            const payload = ticket.getPayload();
            return payload;
        });
    }
}
exports.default = new AuthServices();
