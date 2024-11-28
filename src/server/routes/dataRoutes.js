import { StockMarket_DB } from "../config/DatabaseRegistry.js";
import { getAdvancedStatistics } from "../script/database_script.js";
import stockQueryConfigs from "../config/stockQueryConfigs.js";

export const dataRoutes = {
	getSymbols: {
		path: "/symbols",
		method: "GET",
		pipeline: [
			{
				name: "core",
				handler: async (req, res, next) => {
					try {
						const results = await StockMarket_DB.query(
							stockQueryConfigs.getSymbols
						);

						console.log("Symbols: ", results);

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

						const { symbol, startDate, endDate } = req.query;

						const priceData = StockMarket_DB.query(
							stockQueryConfigs.rawPriceData,
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
						stockQueryConfigs.averageDailyPrice,
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
};
