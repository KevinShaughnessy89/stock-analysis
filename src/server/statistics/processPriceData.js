import { StockMarket_DB } from "../config/DatabaseRegistry.js";


export async function calculateAverage(symbol, startDate, endDate) {
    try {
        const matchStage = {
            $match: {
                symbol: symbol,
                timestamp: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        }
        
        const groupStage = {
            $group: {
            _id: null,
            averageOpen: { $avg: "$open" },
            averageHigh: { $avg: '$high' },
            averageLow: { $avg: '$low'},
            averageClose: { $avg: '$close'},
            averageVolume: { $avg: '$volume'}
            }
        }

        const statistics = await StockMarket_DB.getDb().collection("daily_price").aggregate([matchStage, groupStage]).toArray();

        console.log("Stats returned: ", statistics);
        return statistics;
    }
    catch (error) {
        console.error("Error calculating average prices: ", error.message);
    }
}