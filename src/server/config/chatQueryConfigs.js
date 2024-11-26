import { ChatHistory } from "../models/chatModel.js";

const chatQueryConfigs = {
	getHistory: {
		collection: "chat_history",
		params: {},
		pipeline: [{}],
	},
};
