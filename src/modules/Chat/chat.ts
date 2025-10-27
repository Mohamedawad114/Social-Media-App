import { Socket } from "socket.io";
import { Chat_Evenets } from "./chat.events";

export const ChatInitialization = ( socket: Socket)=> {
    const chatEvents = new Chat_Evenets(socket) as any;
    chatEvents.sendPrivateMessage()
    chatEvents.getConversationMessages()
    chatEvents.sendGroupMessage()
    chatEvents.getGroupMessages()
    
}