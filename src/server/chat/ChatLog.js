import mongoose from "mongoose";
import { mongooseChatDb } from "../config/DatabaseRegistry.js";

const chatLogSchema = new mongoose.Schema({
	chatHistory: {
		entries: [
			{
				username: {
					type: String,
					required: [true, "A username is required"],
					trim: true,
				},
				message: {
					type: String,
					required: false,
					trim: false,
				},
				timestamp: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
});

chatLogSchema.methods.addChatEntry = async function (chatEntry) {
	console.log("ChatLog entry: ", chatEntry);
	console.log("Current entries:", this.chatHistory.entries); // Debug current state

	const isDuplicate = this.chatHistory.entries.some(
		(entry) =>
			entry.username === chatEntry.username &&
			entry.message === chatEntry.message &&
			entry.timestamp === chatEntry.timestamp
	);

	console.log("Is duplicate?", isDuplicate); // Debug duplicate check

	if (isDuplicate) {
		console.log("Skipping duplicate entry");
		return;
	}

	this.chatHistory.entries.push(chatEntry);
	console.log("After push:", this.chatHistory.entries); // Debug after push

	try {
		const saved = await this.save();
		console.log("Save successful:", saved.chatHistory.entries.length); // Debug save
		return saved;
	} catch (error) {
		console.error("Save failed:", error);
		throw error;
	}
};

chatLogSchema.statics.getInstance = async function (roomID) {
	let chat = await this.findOne({ roomID });
	if (!chat) {
		chat = new this({ roomID });
		await chat.save();
	}
	return chat;
};

export const ChatLog = mongooseChatDb.model("ChatLog", chatLogSchema);
