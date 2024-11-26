import mongoose from "mongoose";

const Chat = new mongoose.Schema({
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

Chat.methods.addChatEntry = async function (chatEntry) {
	console.log("Chat entry: ", chatEntry);
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

Chat.statics.getInstance = async function () {
	let chat = await this.findOne();
	if (!chat) {
		chat = new this();
		await chat.save();
	}
	return chat;
};

export const ChatHistory = mongoose.model("Chat", Chat);
