import { Worker } from "bullmq";
import {
  createAndSendOTP,
  createAndSendOTP_password,
  freezeAccount,
} from "../../services/send-email";
import { logger } from "../../../middlwares";
import { redis } from "../../services/redis";

const Handler = {
  confirmation: async (to: string) => {
    await createAndSendOTP(to);
  },
  reset_Password: async (to: string) => {
    await createAndSendOTP_password(to);
  },
  freezeAccount: async (to: string) => {
    await freezeAccount(to);
  },
};

export const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, type } = job.data;
    const Handle = Handler[type as keyof typeof Handler];
    if (Handle) await Handle(to);
    else {
      logger.warn(`No handler found for email type: ${type}`);
    }
  },
  {
    connection: redis,
  }
);

emailWorker.on("completed", (job) => {
  logger.info(`Email job with id ${job.id} has been completed.`);
});
emailWorker.on("failed", (job, err) => {
  logger.error(
    `Email job with id ${job?.id} has failed with error: ${err.message}`
  );
});
