import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
const PORT = 4000;
const app = express();
// app.use(cors({
//     origin: "http://localhost:3000"
// }))
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});
io.on('connection', async (socket) => {
    socket.on("message", async (message) => {
        console.log(message);
        await fetch(`http://localhost:3000/api/chats/messages`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: message?.content,
                chatName: message?.chat?.name,
                senderId: message?.user?.id,
                image: message?.user.image
            })
        });
        socket.broadcast.emit("message", message);
    });
});
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
