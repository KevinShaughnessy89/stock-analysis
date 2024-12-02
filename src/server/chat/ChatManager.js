import { ChatDatabase } from "../config/DatabaseRegistry.js";
import { ChatLog } from "./ChatLog.js";
import { ChatRoom } from "./ChatRoom.js";
import { StockMarket_DB } from "../config/DatabaseRegistry.js";
import { useAuthStore } from "../../client/authStore.js";

class ChatManager {
	static async createRoom(req, res, next) {
		try {
			const { name, creator } = req.body;

			const userDoc = await StockMarket_DB.findDocuments("users", {
				username: creator,
			});

			const userId = userDoc[0]._id;

			const newChatLog = await ChatLog.create({
				chatHistory: [
					{
						entries: [],
					},
				],
			});

			const savedRoom = await ChatRoom.create({
				name: name,
				creator: userId,
				participants: [],
				chatLog: newChatLog._id,
			});

			console.log("New chat room: ", savedRoom);

			res.json({
				success: true,
			});
		} catch (error) {
			console.error("Error creating chat room: ", error);
			res.json({
				success: false,
				error,
			});
		}
	}

	static async getRoomChatHistory(req, res, next) {
		try {
			const { reqRoom } = req.query;

			// const chatRoom = await ChatRoom.findOne({ name: reqRoom });
			// console.log("ChatLog ID in room:", chatRoom.chatLog);

			// // Then check if that ID exists in the chatlogs collection
			// const chatLog = await ChatLog.findById(chatRoom.chatLog);
			// console.log("ChatLog document:", chatLog);

			// // Also worth checking the collections directly
			// const allChatLogs = await ChatLog.find({});
			// console.log("All chat logs:", allChatLogs);

			const chatRoom = await ChatRoom.findOne({
				name: reqRoom,
			});

			console.log("Before populate(): ", chatRoom);

			const chatDocs = await chatRoom.populate("chatLog");

			console.log("After populate: ", chatDocs);

			console.log("chatHistory", chatDocs.chatLog.chatHistory.entries);

			console.log(
				"Current history: ",
				JSON.stringify(chatDocs.chatLog.chatHistory.entries)
			);

			res.status(200).json({
				history: chatDocs.chatLog.chatHistory.entries,
			});
		} catch (error) {
			next(error);
		}
	}

	static async saveChatRoomHistory(req, res, next) {
		try {
			const { reqRoom, reqEntry } = req.body;

			const chatRoom = await ChatRoom.findOne({
				name: reqRoom,
			}).populate("chatLog");

			chatRoom.chatLog.chatHistory.entries.push(reqEntry);

			const save = await chatRoom.chatLog.save();
			console.log("saved variable: ", save);

			res.status(200);
		} catch (error) {
			console.error("Error saving chat history: ", error);
		}
	}

	static async getRoomList(req, res, next) {
		try {
			const roomQuery = await ChatDatabase.findDocuments("rooms");

			const roomList = roomQuery.map((room) => ({
				name: room.name,
			}));

			console.log("roomList: ", roomList);

			res.status(200).json({
				success: true,
				payload: roomList,
			});
		} catch (error) {
			console.error("Error getting room list: ", error);
			return res.status(400).json({
				success: false,
				error: error,
			});
		}
	}
}

export default ChatManager;
