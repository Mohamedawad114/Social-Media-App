import { Socket } from "socket.io";
import { conversation_Repo, Message_Repo } from "../../../repositories";
import { getIo } from "../../../Getways/socket.getway";
import mongoose from "mongoose";

export class Chat_Services {
  private conversationRepo: conversation_Repo = new conversation_Repo();
  private messageRepo: Message_Repo = new Message_Repo();

  async joinPrivateChat(socket: Socket, targetUserId: string) {
    let conversation = await this.conversationRepo.findOneDocument({
      members: { $all: [socket.data.userId, targetUserId] },
      type: "direct",
    });
    if (!conversation) {
      conversation = await this.conversationRepo.createDocument({
        type: "direct",
        members: [socket.data.userId, targetUserId],
      });
    }
    if (conversation._id) socket.join(conversation._id?.toString());
    return conversation;
  }

  async sendPrivateMessage(socket: Socket, data: unknown) {
    const { text, targetUserId } = data as {
      text: string;
      targetUserId: string;
    };
    if (!text || text.trim().length == 0) {
      socket.emit("error message is empty");
      return;
    }
    if (text.trim().length > 1000) {
      socket.emit("error message is veru long");
      return;
    }
    const conversation = await this.joinPrivateChat(socket, targetUserId);
    const message = await this.messageRepo.createDocument({
      text: text,
      senderId: socket.data.userId,
      conversationId: conversation._id,
    });
    getIo()
      .to(conversation._id?.toString() as string)
      .emit("message-send", message);
  }

  async getHistory(socket: Socket, targetUserId: string) {
    const conversation = await this.joinPrivateChat(socket, targetUserId);
    const messages = await this.messageRepo.findDocuments({
      conversationId: conversation._id,
    });
    socket.emit("chat-history", { chat: messages, targetUserId });
  }

  async joinGroupChat(socket: Socket, targetGroupId: string) {
    let conversation = await this.conversationRepo.findOneDocument({
      _id: new mongoose.Types.ObjectId(targetGroupId),
      type: "group",
    });
    if (conversation?._id) socket.join(conversation._id?.toString());
    return conversation;
  }

  async sendGroupMessage(socket: Socket, data: unknown) {
    const { text, targetGroupId } = data as {
      text: string;
      targetGroupId: string;
    };
    const conversation = await this.joinGroupChat(socket, targetGroupId);

    const message = await this.messageRepo.createDocument({
      text: text,
      senderId: socket.data.userId,
      conversationId: conversation?._id,
    });
    getIo()
      .to(conversation?._id?.toString() as string)
      .emit("message-send", message);
  }
  async getGroupHistory(socket: Socket, targetGroupId: string) {
    const conversation = await this.joinGroupChat(socket, targetGroupId);
    const messages = await this.messageRepo.findDocuments({
      conversationId: conversation?._id,
    });
    socket.emit("group-chat-history", { chat: messages, targetGroupId });
  }
}
