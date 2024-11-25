import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
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

chatSchema.methods.addChatEntry = function (chatEntry) {
	if (
		this.chatHistory.entries.some(
			(entry) =>
				entry.username === chatEntry.username &&
				entry.message === chatEntry.message
		)
	) {
		return;
	} else {
		this.entries.push(chatEntry);
		return this.save();
	}
};

export const ChatHistory = mongoose.model("ChatSchema", ChatSchema);
