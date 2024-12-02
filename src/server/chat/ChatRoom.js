import mongoose from "mongoose";
import { mongooseChatDb } from "../config/DatabaseRegistry.js";
import { ChatLog } from "./ChatLog.js";

const chatRoomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	chatLog: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
		ref: "ChatLog", // ref associates the ObjectId with the colletion it belongs to because mongoose is stupi
	},
});

chatRoomSchema.methods.getRoomId = function () {
	return this.chatLog._id;
};

chatRoomSchema.pre("save", function (next) {
	if (!this.participants) {
		this.participants = [];
	}
	if (!this.chatLog) {
		this.chatLog = {
			chatHistory: {
				entries: [],
			},
		};
	}
	// In case chatLog exists but doesn't have the proper structure
	if (!this.chatLog.chatHistory) {
		this.chatLog.chatHistory = { entries: [] };
	}
	if (!this.chatLog.chatHistory.entries) {
		this.chatLog.chatHistory.entries = [];
	}
	next();
});

export const ChatRoom = mongooseChatDb.model("ChatRoom", chatRoomSchema);
