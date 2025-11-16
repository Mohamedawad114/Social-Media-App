"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat_Evenets = void 0;
const chat_services_1 = require("./servcies/chat.services");
class Chat_Evenets {
    constructor(socket) {
        this.socket = socket;
        this.chatServices = new chat_services_1.Chat_Services();
    }
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
exports.Chat_Evenets = Chat_Evenets;
