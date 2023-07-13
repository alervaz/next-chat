"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const prisma_1 = require("../../lib/prisma");
const PORT = 4000;
const app = (0, express_1.default)();
// app.use(cors({
//     origin: "http://localhost:3000"
// }))
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});
io.on('connection', socket => {
    console.log(prisma_1.prisma);
});
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
