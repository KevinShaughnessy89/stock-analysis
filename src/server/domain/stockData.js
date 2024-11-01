import WebScraper from '../services/WebScraper.js';
import axios from 'axios';

// DATABASES
import { StockMarket_DB } from "../config/DatabaseRegistry.js"

// VY7DZFI0W1AD27KR - API KEY ALPHA VANTAGE

const COLLECTION_NAME_DAILY = 'daily_price';    
const STOCK_SYMBOLS = [
    'MMM', 'MSI', 'GD', 'EMR', 'ETN', 'SHW',
    'HUM', 'ITW', 'APD', 'ADSK', 'MCK', 'PAYX'];
const API_KEY = 'VY7DZFI0W1AD27KR';
const BASE_URL = 'https://www.alphavantage.co/query?'

export async function updateStockData() {
    console.log("updating stock...")
    try {
        for (let symbol of STOCK_SYMBOLS) {
            console.log("getting stock data for:", symbol);
            const result = await getStockData(symbol);
            if (result.status != 429) {
                await insertDailyPriceData([result]);
            }
        }
    } catch (error) {
        console.error("Error fetching stock data: ", error);
        throw error;
    }
}

function flattenDailyPriceData(data) {
    const metadata = data['Meta Data'];
    const timeSeries = data['Time Series (Daily)'];

    if (!metadata || !timeSeries) {
        console.error("Error getting metadata or timeseries data from stock API request.");
    }

    const flattenedData = Object.entries(timeSeries).map(([date, values]) => ({
        timestamp: new Date(date),
        symbol: metadata['2. Symbol'],
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'], 10)
    }));

    return flattenedData;
}

async function insertDailyPriceData(data) {
    try {
        await StockMarket_DB.connect();

        data = Array.isArray(data) ? data : [data]; 
        const flattenedData = data.flatMap(flattenDailyPriceData);
        const result = await StockMarket_DB.insertDocuments(COLLECTION_NAME_DAILY, flattenedData);

        console.log(`Inserted ${result.inserted} documents into ${COLLECTION_NAME_DAILY}.`)
    }  
    catch (error) {
        console.error('Error inserting price data: ', error);
    } finally {
        // await database.close();
    }
}

async function getStockData(symbol) 
{
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                apikey: API_KEY
            },
            headers: {
                'User-Agent': 'request'
            },
            timeout: 10000
        });

        if (response.status === 429) {
            console.error("API limit reached.");

        }
        return {
            data: response.data,
            status: response.status
        }
    } catch (error) {
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
               console.error('Error message:', error.message);        }
    }
}

export async function getStockNews(topic) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'NEWS_SENTIMENT',
                topics: topic
            },
            headers: {
                'User-Agent': 'request'
            },
            timeout: 10000
        });

        if (response.status === 429) {
            console.error("API limit reached.");
        }

        return {
            data: response.data,
            status: response.status
        }
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
}