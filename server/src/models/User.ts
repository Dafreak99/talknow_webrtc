import { model, Schema } from "mongoose";
import { User } from "../types";

// Schema
const UserSchema = new Schema<User>({
	username: String,
	socketId: String,
	streamId: String,
	streamType: String,
	avatar: String,
	currentRoomId: String,
});

export default model("User", UserSchema);
