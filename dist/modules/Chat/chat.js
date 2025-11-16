"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInitialization = void 0;
const chat_events_1 = require("./chat.events");
const ChatInitialization = (socket) => {
    const chatEvents = new chat_events_1.Chat_Evenets(socket);
    chatEvents.sendPrivateMessage();
    chatEvents.getConversationMessages();
    chatEvents.sendGroupMessage();
    chatEvents.getGroupMessages();
};
exports.ChatInitialization = ChatInitialization;
