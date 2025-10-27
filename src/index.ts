
import http from "http";
import app from "./app";
import { logger } from "./middlwares";
import { ioInitalization } from "./Getways/socket.getway";

const port = process.env.PORT as string || 3000;

const server = http.createServer(app);

ioInitalization(server);

server.listen(port, () => {
  logger.info(`✅ port ${port} is running....`);
});

export { server };
