"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.ioInitalization = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Errors_1 = require("../common/Errors");
const chat_1 = require("../modules/Chat/chat");
const middlwares_1 = require("../middlwares");
const utils_1 = require("../utils");
let io = null;
function socketAuthanticationMiddleware(socket, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = socket.handshake.auth.authorization;
            const decodedData = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            socket.data = { userId: decodedData.id };
            yield utils_1.redis.sadd(`user_sockets:${decodedData.id}`, socket.id);
            yield utils_1.redis.sadd("online_users", decodedData.id);
            socket.emit("connected", {
                user: { _id: decodedData.id, username: decodedData.username },
            });
            next();
        }
        catch (error) {
            middlwares_1.logger.error(`Socket authentication error:, ${error}`);
            next(new Errors_1.BadRequestException("Authentication error"));
        }
    });
}
function socketDisconnection(socket) {
    socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
        const userId = socket.data.userId;
        yield utils_1.redis.srem(`user_sockets:${userId}`, socket.id);
        const remaining = yield utils_1.redis.scard(`user_sockets:${userId}`);
        if (remaining === 0) {
            yield utils_1.redis.srem("online_users", userId);
            socket.broadcast.emit("userOffline", { userId });
        }
    }));
}
const ioInitalization = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {},
    });
    io.use(socketAuthanticationMiddleware);
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = socket.data.userId;
        middlwares_1.logger.info(`${socket.id} connected`);
        socket.broadcast.emit("userOnline", { userId });
        socketDisconnection(socket);
        (0, chat_1.ChatInitialization)(socket);
        const onlineUserIds = yield utils_1.redis.smembers("online_users");
        const filtered = onlineUserIds.filter((id) => id !== userId);
        socket.emit("allOnlineUsers", { onlineUserIds: filtered });
    }));
};
exports.ioInitalization = ioInitalization;
const getIo = () => {
    if (!io)
        throw new Errors_1.BadRequestException("Socket.IO not initialized");
    return io;
};
exports.getIo = getIo;
