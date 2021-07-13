const express = require("express");
const app = express();
const http = require("http");
const { Server, Socket } = require("socket.io");

const PORT = 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

let rooms = {};
let myRoomId = null;

io.on("connection", (socket) => {
  socket.on("create-room", (data) => {
    let room = {
      ...data,
      hostId: socket.id,
      users: [{ socketId: socket.id, username: data.hostname }],
    };
    rooms[data.roomId] = room;
  });

  socket.on("confirm-room-password", (roomId, password) => {
    if (rooms[roomId].password === password) {
      socket.emit("confirm-room-password", { status: "succeeded" });
    } else {
      console.log("failed");
      socket.emit("confirm-room-password", { status: "failed" });
    }
  });

  socket.on("user-joined", ({ data, type }) => {
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
    } else {
      rooms[roomId].users.push({
        socketId: socket.id,
        username: data.username,
      });
    }

    console.log(rooms);

    const { users, ...roomInfo } = rooms[roomId];

    io.to(socket.id).emit("roominfo", roomInfo);

    io.in(roomId).emit(
      "user-joined",
      socket.id,
      rooms[roomId].users.length,
      rooms[roomId].users
    );
  });

  socket.on("get-room-info", (roomId) => {
    console.log("get-room-info");
    if (!rooms[roomId]) {
      socket.emit("get-room-info", {
        status: "failed",
        message: "Room doesn't exist",
      });
    } else {
      socket.emit("get-room-info", {
        status: "succeeded",
        data: { ...rooms[roomId], users: rooms[roomId].users.length },
      });
    }
  });

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("message", function (data) {
    io.sockets.emit("broadcast-message", socket.id, data);
  });

  socket.on("disconnect", function () {
    if (!rooms[myRoomId].hostId) return;

    if (socket.id === rooms[myRoomId].hostId) {
      // Host leave
      socket.to(myRoomId).emit("host-leave");
      delete rooms[myRoomId];
      myRoomId = null;
      console.log(rooms);
    } else {
      rooms[myRoomId].users = rooms[myRoomId].users.filter(
        (user) => user.socketId !== socket.id
      );

      socket.to(myRoomId).emit("user-leave", socket.id);
    }
  });
});

httpServer.listen(PORT, function () {
  console.log(`Listening at port ${PORT}`);
});
