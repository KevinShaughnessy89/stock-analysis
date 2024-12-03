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
						const priceData = await StockMarket_DB.query(
							stockQueryConfigs.rawPriceData,
							{
								symbol,
								$gte: new Date(startDate),
								$lte: new Date(endDate),
							}
						);

						console.log(
							"getPriceData - priceData: ",
							JSON.stringify(priceData[0])
						);

						if (priceData.length == 0) {
							return res.json({
								message: "No documents found",
								criteria: { symbol, startDate, endDate },
							});
						}
						res.status(200).json(priceData[0].allData);
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
							$gte: new Date(startDate),
							$lte: new Date(endDate),
						}
					);

					console.log("getPriceAverage - averages: ", averages);
					const statistics = await getAdvancedStatistics(
						symbol,
						startDate,
						endDate
					);
					console.log("getPriceAverage - statistics: ", statistics);

					const data = [averages[0], statistics];

					console.log("data from averages: ", JSON.stringify(data));
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
