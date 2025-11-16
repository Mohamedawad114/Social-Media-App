"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./dev.env" });
const key = process.env.CRYPTO_KEY;
const IV = node_crypto_1.default.randomBytes(16);
const encrypt = (text) => {
    const buffer = Buffer.from(key);
    const cipher = node_crypto_1.default.createCipheriv("aes-256-cbc", buffer, IV);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return IV.toString('hex') + ":" + encrypted;
};
exports.encrypt = encrypt;
const decrypt = (textencrypt) => {
    const [Ivhex, encrypted] = textencrypt.split(":");
    const Iv = Buffer.from(Ivhex, 'hex');
    const decipher = node_crypto_1.default.createDecipheriv("aes-256-cbc", key, Iv);
    let decrypted = decipher.update(encrypted, 'hex', "utf-8");
    decrypted += decipher.final('utf-8');
    return decrypted;
};
exports.decrypt = decrypt;
