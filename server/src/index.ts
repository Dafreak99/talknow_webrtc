import express from "express";
import http from "http";
import log4js from "log4js";
import { Server, Socket } from "socket.io";
import { Rooms, User } from "./types";

const logger = log4js.getLogger();

// log4js by default will not output any logs
logger.level = "debug";

const app = express();

const httpServer = http.createServer(app);

const PORT = 5000;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let rooms: Rooms = {};

let myRoomId: string | null = null;

io.on("connection", (socket: Socket) => {
  socket.on("user-joined", ({ data, type }) => {
    logger.debug("User joined");
    const { roomId } = data;

    myRoomId = roomId;
    socket.join(roomId);

    if (type === "host") {
      let room = {
        ...data,
        hostId: socket.id,
        allowVideo: Boolean(data.allowVideo),
        allowAudio: Boolean(data.allowAudio),
        users: [{ socketId: socket.id, username: data.hostname }],
      };
      rooms[roomId] = room;

      const response = {
        ...rooms[roomId],
        users: rooms[roomId].users.length,
      };

      delete response.password;

      socket.emit("get-room-info", {
        status: "succeeded",
        data: response,
      });
    } else {
      rooms[roomId].users.push({
        socketId: socket.id,
        username: data.username,
        avatarUrl: "",
      } as User);
    }
    logger.info("Rooms", rooms);
  });

  socket.on("get-room-info", (roomId: string) => {
    logger.debug("get-room-info", roomId);

    if (!rooms[roomId]) {
      socket.emit("get-room-info", {
        status: "failed",
        message: "Room doesn't exist",
      });
    } else {
      const response = {
        ...rooms[roomId],
        users: rooms[roomId].users.length,
      };

      delete response.password;

      socket.emit("get-room-info", {
        status: "succeeded",
        data: response,
      });
    }
  });

  socket.on("confirm-room-password", (roomId: string, password: string) => {
    if (rooms[roomId].password === password) {
      socket.emit("confirm-room-password", { status: "succeeded" });
    } else {
      socket.emit("confirm-room-password", { status: "failed" });
    }
  });

  socket.on("request-to-join", (roomId: string, username: string) => {
    io.to(rooms[myRoomId as string].hostId).emit(
      "request-to-join",
      roomId,
      username
    );
  });

  socket.on("broadcast-message", (data) => {
    io.sockets.emit("broadcast-message", {
      ...data,
      socketId: socket.id,
    });
  });

  socket.on("share-screen", () => {
    rooms[myRoomId as string].isShareScreen = true;
    io.in(myRoomId as string).emit("share-screen");
  });

  socket.on("disconnect", function () {
    logger.debug("disconnect");

    if (!rooms[myRoomId as string]) return;

    if (socket.id === rooms[myRoomId as string].hostId) {
      // Host leave
      socket.to(myRoomId as string).emit("host-leave");
      delete rooms[myRoomId as string];
      myRoomId = null;

      logger.info("Rooms", rooms);
    } else {
      rooms[myRoomId as string].users = rooms[myRoomId as string].users.filter(
        (user) => user.socketId !== socket.id
      );

      socket.to(myRoomId as string).emit("user-leave", socket.id);
    }
  });
});

httpServer.listen(PORT, () => {
  logger.debug(`Listening at port ${PORT}`);
});
