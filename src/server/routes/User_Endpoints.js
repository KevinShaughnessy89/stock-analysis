import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

// Databases
import { StockMarket_DB } from '../config/DatabaseRegistry.js';
import { groups } from 'd3';

const COLLECTION_NAME_DAILY = 'daily_price';

const userRouter = express.Router();
const __dirname = path.dirname(__filename);

userRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'build', 'index.html'));
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

userRouter.get('/data/symbols', async (req, res) => {
    try {

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
        console.error("Error getting symbols: ", error);
    } 
});

userRouter.get('/data/chart', async (req, res) => {
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
        console.error("Error getting company list: ", error);
        throw error;
    }
});

userRouter.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'public', '404.html'))
});

export default userRouter;
