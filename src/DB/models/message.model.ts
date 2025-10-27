import mongoose from "mongoose";
import { IMessage } from "../../common";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    text: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    attachment: [String],
  },
  {
    timestamps: true,
  }
);
const messageModel = mongoose.model<IMessage>("Message", messageSchema);
export { messageModel };
