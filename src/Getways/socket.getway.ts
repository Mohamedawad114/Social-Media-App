import { Server as ServerScoket, Socket } from "socket.io";
import { Server } from "http";
import Jwt from "jsonwebtoken";
import { BadRequestException } from "../common/Errors";
import { JwtPayloadCustom } from "../common";
import { ChatInitialization } from "../modules/Chat/chat";
export const connectedSockets = new Map<string, string[]>();
let io: ServerScoket | null = null;

function socketAuthanticationMiddleware(socket: Socket, next: Function) {
  const token = socket.handshake.auth.authorization;
  const decodedData = Jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayloadCustom;

  socket.data = { userId: decodedData.id };


  const userTabs = connectedSockets.get(socket.data.userId) || [];
  userTabs.push(socket.id);
  connectedSockets.set(socket.data.userId, userTabs);

  socket.emit("connected", {
    user: { _id: socket.data.userId, username: decodedData.username },
  });

  next();
}

function socketDisconnection(socket: Socket) {
  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    let userTabs = connectedSockets.get(userId) || [];
    userTabs = userTabs.filter((id) => id !== socket.id);

    if (userTabs.length === 0) {
      connectedSockets.delete(userId);

      socket.broadcast.emit("userOffline", { userId });
    } else {
      connectedSockets.set(userId, userTabs);

      socket.broadcast.emit("userOnline", { userId });
    }
  });
}

export const ioInitalization = (server: Server) => {
  io = new ServerScoket(server, {
    cors: {},
  });

  io.use(socketAuthanticationMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log("connection", socket.id);

    socket.broadcast.emit("userOnline", { userId: socket.data.userId });

    socketDisconnection(socket);

    ChatInitialization(socket);


    const onlineUserIds = Array.from(connectedSockets.keys()).filter(id => id !== socket.data.userId);
    socket.emit("allOnlineUsers", { onlineUserIds });
  });
};

export const getIo = () => {
  if (!io) throw new BadRequestException("Socket.IO not initialized");
  return io;
};

