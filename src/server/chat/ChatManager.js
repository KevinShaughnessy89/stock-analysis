import { ChatRoom } from "./ChatRoom";
import { ChatLog } from ".chatModel.js";
import { ChatModel } from "./ChatModel.js";
import { ChatDatabase } from "../config/DatabaseRegistry.js";

class ChatManger {
	async createRoom(req, res, next) {
		try {
			const { name, creator } = req.body;

			const result = await ChatDatabase.insertDocuments("rooms", {
				name,
				creator,
			});

			if (result.error.length === 0) {
				res.json({
					success: true,
				});
			}
		} catch (error) {
			console.error("Error creating chat room");
			res.json({
				success: false,
				error,
			});
		}
	}

	async getRoomChatHistory(req, res, next) {
		try {
			const { reqName } = req.body;

			const roomQuery = ChatDatabase.findDocuments("rooms", {
				name: reqName,
			});

			const chatRoom = roomQuery[0];

			const chatHistory = chatRoom.chatLog.getInstance();

			console.log("Current history: ", JSON.stringify(chatHistory));

			res.status(200).json({ history: chatHistory });
		} catch (error) {
			next(error);
		}
	}

	async saveChatRoomHistory(req, res, next) {
		try {
			console.log("Saving chat history");
			const { reqName, reqEntry } = req.body;

			const roomQuery = await ChatDatabase.findDocuments("rooms", {
				name: reqName,
			});

			const chatRoom = roomQuery[0];

			const chatHistory = await chatRoom.chatLog
				.getInstance()
				.addChatEntry(reqEntry);

			console.log("Updated chat history: ", JSON.stringify(chatHistory));

			res.status(200);
		} catch (error) {
			console.error("Error saving chat history: ", error);
		}
	}

	async getRoomList(req, res, next) {
		try {
			const roomQuery = await ChatDatabase.findDocuments("rooms");

			const roomList = roomQuery.map((room) => ({
				name: room.name,
			}));

			res.status(200).json(roomList);
		} catch (error) {
			console.error("Error getting room list: ", error);
		}
	}
}

export default ChatManager;
