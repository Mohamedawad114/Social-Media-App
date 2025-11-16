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
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const send_email_1 = require("../../services/send-email");
const middlwares_1 = require("../../../middlwares");
const redis_1 = require("../../services/redis");
const Handler = {
    confirmation: (to) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, send_email_1.createAndSendOTP)(to);
    }),
    reset_Password: (to) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, send_email_1.createAndSendOTP_password)(to);
    }),
    freezeAccount: (to) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, send_email_1.freezeAccount)(to);
    }),
};
exports.emailWorker = new bullmq_1.Worker("emailQueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, type } = job.data;
    const Handle = Handler[type];
    if (Handle)
        yield Handle(to);
    else {
        middlwares_1.logger.warn(`No handler found for email type: ${type}`);
    }
}), {
    connection: redis_1.redis,
});
exports.emailWorker.on("completed", (job) => {
    middlwares_1.logger.info(`Email job with id ${job.id} has been completed.`);
});
exports.emailWorker.on("failed", (job, err) => {
    middlwares_1.logger.error(`Email job with id ${job === null || job === void 0 ? void 0 : job.id} has failed with error: ${err.message}`);
});
