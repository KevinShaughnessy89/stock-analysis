import { StockMarket_DB } from "../config/DatabaseRegistry.js";
import { calculateAverage } from "../statistics/processPriceData.js";

const COLLECTION_NAME_DAILY = "daily_price";

export const dataRoutes = {
    getSymbols: {
        path: '/symbols',
        method: 'GET',
        pipeline: [
            {
                name: 'core',
                handler: async (req, res, next) => {
                    try {
                        console.log("We are in");
                        const collection = StockMarket_DB.getDb().collection(COLLECTION_NAME_DAILY);
                
                        let groupStage = {
                            $group: {
                                _id: '$symbol'
                            }
                        };
                
                        let projectStage = {
                            $project: {
                                _id: 0,
                                value: '$_id',
                                label: '$_id'
                            }
                        };
                
                        const pipeline = [groupStage, projectStage];
                
                        const results = await collection.aggregate(pipeline).toArray();
                        res.status(200).json(results)
                    } catch (error) {
                        console.log("Error getting symbols: ", error);
                    } 
                }
            }
        ]
    },

    getPriceData: {
        path: '/prices',
        method: 'GET',
        pipeline: [
            {
                name: "databaseRequest",
                handler: async (req, res, next) => {
                    try {
                        console.log("Get request for daily stock prices");
                        const collection = StockMarket_DB.getDb().collection(COLLECTION_NAME_DAILY);
                
                        const count = await collection.countDocuments();
                        if (count === 0) {
                            return res.json({
                                message: 'No documents found in the collection',
                                totalDocuments: 0
                            });
                        }
                
                        const { symbol, startDate, endDate } = req.query;
                
                        console.log('Query parameters:', {
                            symbol,
                            startDate,
                            endDate
                        });
                        
                        const pipeline = [];
                    
                        const matchStage = {
                            $match: {
                                symbol: symbol,
                                timestamp: { 
                                    $gte: new Date(startDate), 
                                    $lte: new Date(endDate) 
                                }
                            }
                        };
                    
                        pipeline.push(matchStage);
                
                        const result = await collection.aggregate(pipeline).toArray();
                        
                        if (result.length == 0) {
                            return res.json({
                                message: 'No documents found',
                                criteria: { symbol, startDate, endDate }
                            });
                        }
                        res.status(200).json(result);
            
                    } catch (error) {
                        next(error);
                    }
                }
            }
        ]
    },
    getPriceAverage: {
        path: '/prices/average',
        method: 'GET',
        pipeline: [
            {
                name: 'queryDatabase',
                handler: async (req, res, next) => {
                    console.log("did we get here")
                    const {symbol, startDate, endDate} = req.query;

                    const data = await calculateAverage(symbol, startDate, endDate);
                    console.log("data: ", data);
                    if (data) {
                        res.status(200).json(data);
                    } else {
                        res.status(400).json({message: 'Error retrieving price averages'});
                    }
                }
            }
        ]
    }
    
}