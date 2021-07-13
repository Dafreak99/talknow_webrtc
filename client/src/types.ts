export interface User {
  username: string;
  socketId: string;
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
