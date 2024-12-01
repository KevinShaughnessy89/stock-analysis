import ChatManager from "../chat/ChatManager.js";

export const chatRoutes = {
	saveChatHistory: {
		path: "/history",
		method: "POST",
		pipeline: [
			{
				name: "save",
				handler: ChatManger.saveRoomChatHistory(req, res, next),
			},
		],
	},
	getChatHistory: {
		path: "/history",
		method: "GET",
		pipeline: [
			{
				name: "return",
				handler: ChatManager.getRoomChatHistory(req, res, next),
			},
		],
	},
	creatRoom: {
		path: "/create",
		method: "POST",
		pipeline: [
			{
				name: "create",
				handler: ChatManager.createRoom(req, res, next),
			},
		],
	},
	getRoomList: {
		path: "/info/rooms",
		method: "GET",
		pipeline: [
			{
				name: "getList",
				handler: ChatManager.getRoomList(req, res, next),
			},
		],
	},
};
