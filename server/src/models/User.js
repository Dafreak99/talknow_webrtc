"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema
const UserSchema = new mongoose_1.Schema({
    username: String,
    socketId: String,
    streamId: String,
    streamType: String,
    avatar: String,
    currentRoomId: String,
});
exports.default = mongoose_1.model("User", UserSchema);
