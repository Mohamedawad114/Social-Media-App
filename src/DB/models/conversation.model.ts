import mongoose from "mongoose";
import { conversation, IConversation } from "../../common";

const conversationchema = new mongoose.Schema<IConversation>(
  {
    type: {
      type: String,
      default:conversation.direct,
      enum: conversation,
    },
    name: String,
    members: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const conversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationchema
);
export { conversationModel };
