import mongoose from "mongoose";

const ChatLog = new mongoose.Schema({
	chatHistory: {
		entries: [
			{
				username: {
					type: String,
					required: [true, "A username is required"],
					unique: true,
					trim: true,
				},
				message: {
					type: String,
					required: false,
					unique: false,
					trim: false,
				},
				timestamp: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	default: [],
});

ChatLog.methods.addChatEntry = async function (chatEntry) {
	console.log("ChatLog entry: ", chatEntry);
	if (
		this.chatHistory.entries.some(
			(entry) =>
				entry.username === chatEntry.username &&
				entry.message === chatEntry.message &&
				entry.timestamp === chatEntry.timestamp
		)
	) {
		return;
	} else {
		this.chatHistory.entries.push(chatEntry);
		return await this.save();
	}
};

ChatLog.statics.getInstance = async function (roomID) {
	let chat = await this.findOne({ roomID });
	if (!chat) {
		chat = new this({ roomID });
		await chat.save();
	}
	return chat;
};

export const ChatHistory = mongoose.model("ChatLog", ChatLog);
