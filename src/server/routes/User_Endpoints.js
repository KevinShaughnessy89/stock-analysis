import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import AuthServices from '../services/authServices.js';
const __filename = fileURLToPath(import.meta.url);
import WebScraper from '../services/WebScraper.js';
import { getStockNews } from '../domain/stockData.js';
import axios from 'axios'

const STOCK_SYMBOLS = [
    'MMM', 'MSI', 'GD', 'EMR', 'ETN', 'SHW',
    'HUM', 'ITW', 'APD', 'ADSK', 'MCK', 'PAYX'];
const API_KEY = 'VY7DZFI0W1AD27KR';
const BASE_URL = 'https://www.alphavantage.co/query?'


// Databases
import { StockMarket_DB } from '../config/DatabaseRegistry.js';
import { groups } from 'd3';
import { User } from '../models/userModel.js';

const COLLECTION_NAME_DAILY = 'daily_price';

const userRouter = express.Router();
const __dirname = path.dirname(__filename);

// TODO - Implement error handling with globalErrorHandler

userRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'build', 'index.html'));
});

userRouter.post('/user/register', AuthServices.sameOrigin, async (req,res) => {
    try {

        const {username, password, email} = req.body;

        const result = await AuthServices.register( // returns token and user pointer
            {
                username: username,
                password: password,
                email: email
            }
        );

        res.status(200).json({message: `Registration successful for user: ${username}`});

    }
    catch (error) {
        console.error("Error registering user: ", error);
    }
});

userRouter.post('/user/login', async (req, res) => {
    try {

        const {username, password} = req.body;

        const result = await AuthServices.login({
            username: username,
            password: password
        });

        console.log("login complete.")

        res.cookie('jwt', result.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000
        })
        
        res.json({
            success: true
        })
    }
    catch (error) {
        console.error("Error logging in user: ", error);
    }
})

userRouter.post('/user/logout', AuthServices.sameOrigin, async (req, res) => {
    res.clearCookies('jwt');
    res.status(200).json({message: "Logout successful."});
});

userRouter.get('/user/info',   (req, res, next) => {
    console.log("Request received, cookies:", req.cookies);
    console.log("Query params:", req.query);
    next();
  }, AuthServices.verifyToken, async (req, res) => {

    console.log("/user/info/ endpoint reached with fields: ", req.query.fields);
    
    const fields = req.query.fields?.split(',').reduce((obj, field) => {
        obj[field] = 1;
        return obj;
    }, {})
    
    console.log("Found field: ", fields)
    const existingUser = await User.findById(req.decoded.id, fields);
    console.log("Found user: ", existingUser)

    if (!existingUser) {
        return res.status(200).json({guest: true});
    }

    return res.status(200).json(existingUser);

})


// userRouter.post("/scrape", async (req, res) => {
//     try {
        
//         const {url} = req.body;
        
//         if (!url) {
//             console.log("URL is missing in the request");
//             return res.status(400).json({ error: 'URL is required' });
//         }
        
//         const scraper = new WebScraper();
//         const scrapedData = await scraper.getRawHtml(url);
//         console.log("Data being sent:", scrapedData);
//         return (scrapedData);
//     } 
//     catch(error) {
//         console.error("Error in POST route: /scrape: ", error);
//     }
// });

userRouter.post('/data/news', async (req, res) => {
    try {
        console.log("Making API call")
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'NEWS_SENTIMENT',
                ...(req.body.topics && { topics: req.body.topics }),
                ...(req.body.tickers && { tickers: req.body.tickers }),
                apikey: API_KEY
            },
            headers: {
                'User-Agent': 'request'
            },
            timeout: 10000
        });

        console.log(response);
        
        if (response.status === 429) {
            console.error("API limit reached.");
        }

        return response.data.feed;

    } catch (error) {
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
               console.error('Error message:', error.message);        
        }
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
