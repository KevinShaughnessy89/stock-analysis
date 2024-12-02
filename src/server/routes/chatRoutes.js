import ChatManager from "../chat/ChatManager.js";

export const chatRoutes = {
	saveChatHistory: {
		path: "/history",
		method: "POST",
		pipeline: [
			{
				name: "save",
				handler: async (req, res, next) =>
					await ChatManager.saveChatRoomHistory(req, res, next),
			},
		],
	},
	getChatHistory: {
		path: "/history",
		method: "GET",
		pipeline: [
			{
				name: "return",
				handler: async (req, res, next) =>
					await ChatManager.getRoomChatHistory(req, res, next),
			},
		],
	},
	creatRoom: {
		path: "/create",
		method: "POST",
		pipeline: [
			{
				name: "create",
				handler: async (req, res, next) =>
					await ChatManager.createRoom(req, res, next),
			},
		],
	},
	getRoomList: {
		path: "/info/rooms",
		method: "GET",
		pipeline: [
			{
				name: "getList",
				handler: async (req, res, next) =>
					await ChatManager.getRoomList(req, res, next),
			},
		],
	},
};
