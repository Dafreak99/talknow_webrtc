import express from "express";
import http from "http";
import log4js from "log4js";
import { Server, Socket } from "socket.io";
import { Room, Rooms, User } from "./types";

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
    if (!data) return;

    logger.debug("User joined");
    const { roomId } = data;

    myRoomId = roomId;
    socket.join(roomId);

    if (type === "host") {
      const { roomId, allowVideo, allowAudio } = data;
      let room: Room = {
        ...data,
        hostId: socket.id,
        allowVideo: Boolean(allowVideo),
        allowAudio: Boolean(allowAudio),
        users: [],
      };

      rooms[roomId] = room;
      io.to(socket.id).emit("host-room-info", rooms[roomId]);
    }

    // Treat host as normal user

    const user = {
      username: type === "host" ? data.hostName : data.username,
      streamId: data.streamId,
      streamType: data.streamType,
      socketId: socket.id,
      avatarUrl: "",
    } as User;

    rooms[roomId].users.push(user);

    io.in(roomId).emit("user-joined", user);

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
    logger.debug("request-to-join");
    io.to(rooms[myRoomId as string].hostId).emit(
      "request-to-join",
      socket.id,
      username
    );
  });

  socket.on(
    "answer-request-to-join",
    (data: { socketId: string; isAccepted: boolean }) => {
      io.to(data.socketId).emit("answer-requeqst-to-join", data.isAccepted);
    }
  );

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

  socket.on("white-board", () => {
    logger.debug("white-board");
    io.in(myRoomId as string).emit("white-board");
  });

  socket.on("kick-user", (socketId: string) => {
    logger.debug("kick-user " + socketId);

    io.to(socketId).emit("kick-user");
  });

  socket.on("disconnect", function () {
    logger.debug("disconnect");

    if (!rooms[myRoomId as string]) return;

    if (socket.id === rooms[myRoomId as string].hostId) {
      // Host leave
      socket.to(myRoomId as string).emit("host-leave");
      delete rooms[myRoomId as string];
      myRoomId = null;
    } else {
      rooms[myRoomId as string].users = rooms[myRoomId as string].users.filter(
        (user) => user.socketId !== socket.id
      );

      // socket.to(myRoomId as string).emit("user-leave", socket.id);
    }
    logger.info("Rooms", rooms);
  });
});

httpServer.listen(PORT, () => {
  logger.debug(`Listening at port ${PORT}`);
});
