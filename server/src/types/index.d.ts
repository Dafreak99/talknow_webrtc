import { Schema } from "mongoose";

export interface Rooms {
	[key: string]: Room;
}

// export interface Room {
//   hostName: string;
//   hostId: string;
//   roomId: string;
//   roomName: string;
//   allowVideo: string;
//   allowAudio: string;
//   admission: string;
//   password?: string;
//   users: Array<User>;
//   isShareScreen: boolean;
//   screenId: string;
// }

// interface User {
//   username: string;
//   socketId: string;
//   streamId: string;
//   streamType: string;
//   avatar: string;
// }

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
	avatar: string;
	currentRoomId: string;
}
