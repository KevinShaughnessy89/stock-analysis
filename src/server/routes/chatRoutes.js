import { ChatHistory } from "../models/chatModel.js";

export const chatRoutes = {
	saveChatHistory: {
		path: "/history",
		method: "POST",
		pipeline: [
			{
				name: "save",
				handler: async (req, res, next) => {
					try {
						console.log("Saving chat history");

						const newEntry = {
							username: req.body.username,
							message: req.body.entry,
							timestamp: req.body.timestamp,
						};

						const chatHistory = await ChatHistory.getInstance();
						await chatHistory.addChatEntry(newEntry);

						console.log(
							"Updated chat history: ",
							JSON.stringify(chatHistory)
						);

						res.status(200);
					} catch (error) {
						next(error);
					}
				},
			},
		],
	},
	getChatHistory: {
		path: "/history",
		method: "GET",
		pipeline: [
			{
				name: "return",
				handler: async (req, res, next) => {
					try {
						const chatHistory = await ChatHistory.getInstance();
						console.log(
							"Current history: ",
							JSON.stringify(chatHistory)
						);
						res.status(200).json({ history: chatHistory });
					} catch (error) {
						next(error);
					}
				},
			},
		],
	},
};
