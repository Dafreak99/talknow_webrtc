import cors from "cors";
import express, { Request, Response } from "express";
import http from "http";
import log4js from "log4js";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import Room from "./models/Room";
import User from "./models/User";

const logger = log4js.getLogger();

// log4js by default will not output any logs
logger.level = "debug";

const app = express();
app.use(
  cors({
    origin: "https://talknow.tk",
  })
);

const httpServer = http.createServer(app);

const PORT = 5000;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const getCurrentRoom = async (socketId: string) => {
  let user = await User.findOne({ socketId });
  if (!user) return;

  return user.currentRoomId;
};

async function main() {
  await mongoose.connect(
    "mongodb+srv://haitran99:programmer2211@cluster0.xpopo.mongodb.net/talknow?retryWrites=true&w=majority"
  );

  app.get("/", (req, res) => {
    res.send("hello");
  });

  app.get("/show", async (req: Request, res: Response) => {
    let room = await Room.find().populate("users");
    res.send(room);
  });
}

io.on("connection", (socket: Socket) => {
  socket.on("user-joined", async ({ data, type }) => {
    if (!data) return;

    logger.debug("User joined");

    const {
      roomId,
      hostName,
      username,
      streamId,
      streamType,
      avatar,
      isMicrophoneEnabled,
    } = data;

    socket.join(roomId);

    const user = new User({
      username: type === "host" ? hostName : username,
      socketId: socket.id,
      currentRoomId: roomId,
      streamId,
      streamType,
      avatar,
      isMicrophoneEnabled,
    });

    await user.save();

    logger.info("user", user);

    if (type === "host") {
      const { allowVideo, allowAudio } = data;

      let room = new Room({
        ...data,
        roomId,
        hostId: socket.id,
        allowVideo: Boolean(allowVideo),
        allowAudio: Boolean(allowAudio),
        users: [user._id],
      });

      io.to(socket.id).emit("host-room-info", { ...room, users: [user] });

      await room.save();
      logger.debug("Room-1", room);
    } else {
      let room = await Room.findOne({ roomId });

      if (!room) return;

      room.users.push(user._id);

      room.save();
      io.in(roomId).emit("user-joined", user);

      logger.info("Room-2", room);
    }
  });

  socket.on("get-room-info", async (roomId: string) => {
    logger.debug("get-room-info", roomId);

    let room = await Room.findOne({ roomId })
      .populate("users")
      .select(["-password"]);

    if (!room) {
      socket.emit("get-room-info", {
        status: "failed",
        message: "Room doesn't exist",
      });
    } else {
      socket.emit("get-room-info", {
        status: "succeeded",
        data: room,
      });
    }
  });

  socket.on(
    "confirm-room-password",
    async (roomId: string, password: string) => {
      let room = await Room.findOne({ roomId });
      if (!room) return;

      if (room.password === password) {
        socket.emit("confirm-room-password", { status: "succeeded" });
      } else {
        socket.emit("confirm-room-password", { status: "failed" });
      }
    }
  );

  socket.on("request-to-join", async (roomId: string, username: string) => {
    logger.debug("request-to-join");

    let room = await Room.findOne({ roomId });
    if (!room) return;

    io.to(room.hostId).emit("request-to-join", socket.id, username);
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

  socket.on("share-screen", async (roomId: string) => {
    await Room.findOneAndUpdate({ roomId }, { isShareScreen: true });

    io.in(roomId as string).emit("share-screen");
  });

  socket.on("white-board", (roomId: string) => {
    logger.debug("white-board");
    io.in(roomId).emit("white-board");
  });

  socket.on("kick-user", (socketId: string) => {
    logger.debug("kick-user " + socketId);
    io.to(socketId).emit("kick-user");
  });

  socket.on("send-poll-data", (data: any, roomId: string) => {
    logger.debug("poll", data);
    logger.debug("roomIddđ", roomId);

    socket.to(roomId).emit("send-poll-data", data);
  });

  socket.on("send-vote", (data: { hostId: string; answer: string }) => {
    const { hostId, answer } = data;
    io.to(hostId).emit("send-vote", answer);
  });

  socket.on("toggle-mic", (boo: boolean, roomId: string, from: string) => {
    socket.to(roomId).emit("toggle-mic", boo, from);
  });

  socket.on("disconnect", async function () {
    logger.debug("disconnect");

    let myRoomId = await getCurrentRoom(socket.id);
    let leaveUser = await User.findOne({ socketId: socket.id });

    if (!leaveUser) return;

    logger.debug("leave user", leaveUser);

    if (!myRoomId) return;

    let room = await Room.findOne({ roomId: myRoomId });
    if (!room) return;

    if (socket.id === room.hostId) {
      // Host leave
      socket.to(myRoomId as string).emit("host-leave");
      // delete rooms[myRoomId as string];
      await Room.findOneAndRemove({ roomId: myRoomId });
      await User.deleteMany({ currentRoomId: myRoomId });
    } else {
      let users = room.users!.filter(
        (user: any) => user!._id !== leaveUser!._id
      );
      // TODO: cannot remove user after leave yet
      logger.debug("socketId", socket.id);
      logger.debug("after out", users);
      await Room.findOneAndUpdate(
        { roomId: myRoomId },
        {
          users,
        }
      );

      socket.to(myRoomId as string).emit("user-leave", socket.id);
    }

    await User.findOneAndRemove({ _id: leaveUser._id });
  });
});

main();

httpServer.listen(PORT, () => {
  logger.debug(`Listening at port ${PORT}`);
});
