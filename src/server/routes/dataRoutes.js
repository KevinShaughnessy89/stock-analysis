import { StockMarket_DB } from "../config/DatabaseRegistry.js";
import { getAdvancedStatistics } from "../script/database_script.js";
import queryConfigs from "../config/queryConfigs.js";
import { ChatHistory } from "../models/chatModel.js";

export const dataRoutes = {
	getSymbols: {
		path: "/symbols",
		method: "GET",
		pipeline: [
			{
				name: "core",
				handler: async (req, res, next) => {
					try {
						const results = StockMarket_DB.query(
							queryConfigs.getSymbols,
							{}
						);

						res.status(200).json(results);
					} catch (error) {
						console.log("Error getting symbols: ", error);
					}
				},
			},
		],
	},

	getPriceData: {
		path: "/prices",
		method: "GET",
		pipeline: [
			{
				name: "databaseRequest",
				handler: async (req, res, next) => {
					try {
						console.log("Get request for daily stock prices");

						const count = await collection.countDocuments();
						if (count === 0) {
							return res.json({
								message: "No documents found in the collection",
								totalDocuments: 0,
							});
						}

						const { symbol, startDate, endDate } = req.query;

						const priceData = StockMarket_DB.query(
							queryConfigs.rawPriceData,
							{
								symbol,
								startDate,
								endDate,
							}
						);

						if (priceData.length == 0) {
							return res.json({
								message: "No documents found",
								criteria: { symbol, startDate, endDate },
							});
						}
						res.status(200).json(priceData);
					} catch (error) {
						next(error);
					}
				},
			},
		],
	},
	getPriceAverage: {
		path: "/prices/average",
		method: "GET",
		pipeline: [
			{
				name: "queryDatabase",
				handler: async (req, res, next) => {
					console.log("did we get here");
					const { symbol, startDate, endDate } = req.query;

					const averages = await StockMarket_DB.query(
						queryConfigs.averageDailyPrice,
						{
							symbol,
							startDate,
							endDate,
						}
					);

					const statistics = await getAdvancedStatistics(
						symbol,
						startDate,
						endDate
					);

					const data = [averages, statistics];
					if (data) {
						res.status(200).json(data);
					} else {
						res.status(400).json({
							message: "Error retrieving price averages",
						});
					}
				},
			},
		],
	},
	saveChatHistory: {
		path: "/chat/save",
		params: {
			username: true,
			entry: true,
		},
		pipeline: [
			{
				name: "saveHistory",
				handler: async (req, res, next) => {
					try {
						console.log("Saving chat history");
						const newEntry = {
							username: req.body.username,
							entry: req.body.entry,
						};
						const updatedChat = ChatHistory.findOneAndUpdate(
							{},
							{ $push: { entries: newEntry } },
							{ $upsert: true, new: true }
						);

						console.log("Updated chat history: ", updatedChat);

						res.status(200);
					} catch (error) {
						next(error);
					}
				},
			},
		],
	},
};
