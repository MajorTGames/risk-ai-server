import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { lobbyHandler } from "./src/lobbyhandler";

const app = express();
app.use(cors);
const port = 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  lobbyHandler(socket);
});

server.listen(port, () => {
  console.log(`Hello World - listening on *:${port}`);
});
