
import { Server as ServerScoket, Socket } from "socket.io";
import { Server } from "http";
import Jwt from "jsonwebtoken";
import { BadRequestException } from "../common/Errors";
import { JwtPayloadCustom } from "../common";
import { ChatInitialization } from "../modules/Chat/chat";
import { logger } from "../middlwares";
import { redis } from "../utils";

let io: ServerScoket | null = null;
async function socketAuthanticationMiddleware(socket: Socket, next: Function) {
  try {
    const token = socket.handshake.auth.authorization;
    const decodedData = Jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as JwtPayloadCustom;
    socket.data = { userId: decodedData.id };

    await redis.sadd(`user_sockets:${decodedData.id}`, socket.id);

    await redis.sadd("online_users", decodedData.id as string);
    socket.emit("connected", {
      user: { _id: decodedData.id, username: decodedData.username },
    });

    next();
  } catch (error) {
    logger.error(`Socket authentication error:, ${error}`);
    next(new BadRequestException("Authentication error"));
  }
}

function socketDisconnection(socket: Socket) {
  socket.on("disconnect", async () => {
    const userId = socket.data.userId;
    await redis.srem(`user_sockets:${userId}`, socket.id);
    const remaining = await redis.scard(`user_sockets:${userId}`);

    if (remaining === 0) {
      await redis.srem("online_users", userId);

      socket.broadcast.emit("userOffline", { userId });
    }
  });
}

export const ioInitalization = (server: Server) => {
  io = new ServerScoket(server, {
    cors: {},
  });

  io.use(socketAuthanticationMiddleware);

  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.userId;

    logger.info(`${socket.id} connected`);

    socket.broadcast.emit("userOnline", { userId });

    socketDisconnection(socket);
    ChatInitialization(socket);
    const onlineUserIds = await redis.smembers("online_users");
    const filtered = onlineUserIds.filter((id) => id !== userId);

    socket.emit("allOnlineUsers", { onlineUserIds: filtered });
  });
};

export const getIo = () => {
  if (!io) throw new BadRequestException("Socket.IO not initialized");
  return io;
};

