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
exports.s3_services = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const fs_1 = require("fs");
class s3_services {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.key_folder = process.env.AWS_FOLDER;
    }
    getSignedUrl(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const getCommand = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            });
            return yield (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, { expiresIn: 40 });
        });
    }
    upload_file(file, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const key_name = `${this.key_folder}/${key}/${Date.now()}_${file.originalname}`;
            const params = {
                Key: key_name,
                Bucket: process.env.AWS_S3_BUCKET,
                Body: (0, fs_1.createReadStream)(file.path),
                ContentType: file.mimetype,
            };
            const putCommand = new client_s3_1.PutObjectCommand(params);
            yield this.s3Client.send(putCommand);
            return {
                Key: key_name,
            };
        });
    }
    upload_files(files, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let Urls = [];
            yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const { Key } = yield this.upload_file(file, key);
                Urls.push(Key);
            })));
            return Urls;
        });
    }
    deleteFile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            });
            return yield this.s3Client.send(deleteCommand);
        });
    }
    deleteBUlk(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteCommand = new client_s3_1.DeleteObjectsCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Delete: {
                    Objects: keys.map((key) => ({ Key: key })),
                },
            });
            return yield this.s3Client.send(deleteCommand);
        });
    }
    listderictory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.ListObjectsV2Command({
                Bucket: process.env.AWS_S3_BUCKET,
                Prefix: `${this.key_folder}/${path}/`,
            });
            return yield this.s3Client.send(command);
        });
    }
    deleteListderictory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const files = yield this.listderictory(path);
            const keys = ((_a = files.Contents) === null || _a === void 0 ? void 0 : _a.map((file) => file.Key)) || [];
            return yield this.deleteBUlk(keys);
        });
    }
}
exports.s3_services = s3_services;
