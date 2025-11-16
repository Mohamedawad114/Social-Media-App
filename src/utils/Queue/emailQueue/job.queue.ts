import { Queue } from "bullmq";
import { redis } from "../../services/redis";

export const emailQueue = new Queue("emailQueue", { connection: redis });

export const sendEmailJob = async (
  to: string,
  type: string,
) => {
    await emailQueue.add("sendEmail", { to, type }, {
        attempts: 3,
        removeOnFail: false,
        removeOnComplete:true
        
    })
  }

