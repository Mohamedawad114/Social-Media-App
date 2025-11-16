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
exports.sendEmailJob = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../services/redis");
exports.emailQueue = new bullmq_1.Queue("emailQueue", { connection: redis_1.redis });
const sendEmailJob = (to, type) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.emailQueue.add("sendEmail", { to, type }, {
        attempts: 3,
        removeOnFail: false,
        removeOnComplete: true
    });
});
exports.sendEmailJob = sendEmailJob;
