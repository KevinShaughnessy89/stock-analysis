import mongoose from "mongoose";

const ChatRoom = new mongoose.Schema({
	name: {
		type: String,
		required: true,
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
			default: [],
		},
	],
	chatLog: {
		type: ChatLog,
		default: () => ({}),
	},
});

export const Chatroom = mongoose.Model("ChatRoom", ChatRoom);
