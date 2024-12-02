import { ChatLog } from "../chat/ChatLog.js";

const chatQueryConfigs = {
	getHistory: {
		collection: "chat_history",
		params: {},
		pipeline: [{}],
	},
};
