import Database from "./Database.js";
import mongoose from "mongoose";

const SYSTEM_FLAG = "system_flags";
const STOCK_DB_NAME = "stock_db";
const CHAT_DB_NAME = "chat_db";

export const StockMarket_DB = new Database(STOCK_DB_NAME);
export const ChatDatabase = new Database(CHAT_DB_NAME);
export const mongooseStockDb = await mongoose.createConnection(
	"mongodb://kevinshaughnessy89:turkey@35.208.160.118:27017/stock_db?authSource=admin"
);
export const mongooseChatDb = await mongoose.createConnection(
	"mongodb://kevinshaughnessy89:turkey@35.208.160.118:27017/chat_db?authSource=admin"
);

const stockDatabaseParams = [
	{
		collectionName: "daily_price",
		timeSeriesParams: {
			timeseries: {
				timeField: "timestamp",
				metaField: "symbol",
				granularity: "hours",
			},
		},
	},
];

const chatDatabaseParams = [
	{
		collectionName: "rooms",
	},
];

const databases = [
	{
		name: STOCK_DB_NAME,
		object: StockMarket_DB,
		params: stockDatabaseParams,
	},
	{
		name: CHAT_DB_NAME,
		object: ChatDatabase,
		paras: chatDatabaseParams,
	},
];

export async function connectDatabases(client) {
	// Daily Stock Prices
	try {
		databases.forEach(async (database) => {
			const db = client.db(database.name);

			const setupComplete = await db
				.collection(SYSTEM_FLAG)
				.findOne({ _id: "database_setup" });
			if (!setupComplete) {
				console.log("Running initial database setup...");
				await database.object.setupDatabase(database.params);

				await db
					.collection(SYSTEM_FLAG)
					.updateOne(
						{ _id: "database_setup" },
						{ $set: { completed: true, timestamp: new Date() } },
						{ upsert: true }
					);
			} else {
				database.object.connect();
			}
		});
	} catch (error) {
		console.error("Error during initial database setup: ", error);
	}
}
