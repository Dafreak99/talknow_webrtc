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
  users: Array<User>;
  isShareScreen: boolean;
  isWhiteBoard: boolean;
  screenId: string;
}

interface User {
  username: string;
  streamId: string;
  socketId: string;
  stream: MediaStream;
  streamType: string;
}

export interface ConfigRoom {
  hostName: string;
  roomId: string;
  roomName: string;
  allowVideo: string;
  allowAudio: string;
  admission: string;
  password: string;
}
