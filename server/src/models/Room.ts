import { model, Schema } from "mongoose";
import { Room } from "./../types/index.d";

// Schema
const RoomSchema = new Schema<Room>({
	hostName: { type: String, required: true },
	hostId: { type: String, required: true },
	roomId: { type: String, required: true },
	roomName: { type: String, required: true },
	allowAudio: { type: Boolean, required: true },
	allowVideo: { type: Boolean, required: true },
	admission: { type: String, required: true },
	password: { type: String },
	isShareScreen: { type: Boolean },
	screenId: { type: String },
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model("Room", RoomSchema);
