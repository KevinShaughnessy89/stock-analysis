import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

// Databases
import { StockMarket_DB } from '../config/DatabaseRegistry.js';

const COLLECTION_NAME_DAILY = 'daily-price';

const userRouter = express.Router();
const __dirname = path.dirname(__filename);

userRouter.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', '..', 'build', 'index.html'));
})

userRouter.post("/scrape", async (req, res) => {
    const {url} = req.body;

    if (!url) {
        console.log("URL is missing in the request");
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const scraper = new WebScraper();
        const scrapedData = await scraper.scrapeAll(url);
        console.log("Data being sent:", scrapedData);
        res.json(scrapedData);
    } catch(error) {
        console.error("Error in POST route: /scraped: ", error);
        res.status(500).json({ 
            error: 'Failed to scrape website',
            message: error.message,
            stack: error.stack
        });
    }
});

userRouter.get('/data/chart', async (req, res) => {
    try {
        console.log("Get request for daily stock prices");
        const collection = StockMarket_DB.getDb().collection(COLLECTION_NAME_DAILY);

        const count = await collection.countDocuments();
        if (count === 0) {
            return res.status(404).json({
                message: 'No documents found in the collection',
                totalDocuments: 0
            });
        }

        const { symbol, startDate, endDate } = req.query;

        // const pipeline = [];

        // const matchStage = {
        //     $match: {
        //         symbol: symbol,
        //         timestamp: { 
        //             $gte: new Date(startDate), 
        //             $lte: new Date(endDate) 
        //         }
        //     }
        // };
        
        // const groupStage = {
        //     $group: {
        //         _id: symbol,
        //         averageHigh: { $avg: '$high' },
        //         averageLow: { $avg: '$low'}
        //     }
        // };

        // const sortStage = {
        //     $sort: {
        //         averageHigh: -1
        //     }
        // };
        
        // const result = await collection.aggregate([
        //     matchStage,
        //     groupStage,
        //     sortStage
        // ]).toArray();

        const result = await collection.find({}).toArray();
        
        if (result.length == 0) {
            return res.json({
                message: 'No documents found',
                criteria: { symbol, startData, endDate }
            });
        }
        res.json(result);

    } catch (error) {
        console.error("Error getting company list: ", error);
        throw error;
    }
});

userRouter

export default userRouter;
