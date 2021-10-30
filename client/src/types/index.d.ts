export interface Rooms {
  [key: string]: Room;
}

export interface Room {
  hostName: string;
  hostId: string;
  roomId: string;
  roomName: string;
  allowVideo: string;
  allowAudio: string;
  admission: string;
  password?: string;
  isShareScreen: boolean;
  isWhiteBoard: boolean;
  screenId: string;
  users: Array<User>;
  joinRequests: Array<Request>;
}

interface User {
  username: string;
  streamId: string;
  socketId: string;
  stream: MediaStream;
  streamType: string;
  isSpeaking: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
  avatar: string;
}

export interface Request {
  socketId: string;
  username: string;
}

export interface ConfigRoom {
  hostName: string;
  roomId: string;
  roomName: string;
  allowVideo: string;
  allowAudio: string;
  admission: string;
  password: string;
  avatar: string;
}
