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
  screenId: string;
}

export interface User {
  socketId: string;
  username: string;
  avatarUrl: string;
}
