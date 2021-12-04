import { Schema } from "mongoose";

export interface Rooms {
  [key: string]: Room;
}

// Document interface
export interface Room {
  hostName: string;
  hostId: string;
  roomId: string;
  roomName: string;
  allowVideo: boolean;
  allowAudio: boolean;
  admission: string;
  password?: string;
  users: Array<Schema.Types.ObjectId>;
  isShareScreen: boolean;
  screenId: string;
}

// Document interface
export interface User {
  username: string;
  socketId: string;
  streamId: string;
  streamType: string;
  isMicrophoneEnabled: { type: boolean; default: false };
  isCameraEnabled: { type: boolean; default: false };
  avatar: string;
  currentRoomId: string;
}
