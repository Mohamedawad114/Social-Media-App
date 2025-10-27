import { Socket } from "socket.io";
import { Chat_Services } from "./servcies/chat.services";

export class Chat_Evenets {
  private chatServices = new Chat_Services();
  constructor(private socket: Socket) {}

  getConversationMessages() {
    this.socket.on("get-chat-history", (data) => {
      this.chatServices.getHistory(this.socket, data);
    });
  }
  sendPrivateMessage() {
    this.socket.on("send-private-message", (data) => {
      this.chatServices.sendPrivateMessage(this.socket, data);
    });
  }
  sendGroupMessage() {
    this.socket.on("send-group-message", (data) => {
      this.chatServices.sendGroupMessage(this.socket, data);
    });
  }
  getGroupMessages() {
    this.socket.on("get-group-chat", (data) => {
      this.chatServices.getGroupHistory(this.socket, data);
    });
  }
}
