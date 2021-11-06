"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema
const RoomSchema = new mongoose_1.Schema({
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
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
});
exports.default = mongoose_1.model("Room", RoomSchema);
