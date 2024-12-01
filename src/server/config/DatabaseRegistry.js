import Database from "./Database.js";

const SYSTEM_FLAG = "system_flags";

export const StockMarket_DB = new Database(STOCK_DB_NAME);
export const ChatDatabase = new Database(CHAT_DB_NAME);

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
		name: "stock_db",
		object: StockMarket_DB,
		params: stockDatabaseParams,
	},
	{
		name: "chat_db",
		object: ChatDatabase,
		paras: chatDatabaseParams,
	},
];

export async function connectDatabases(client, params) {
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
