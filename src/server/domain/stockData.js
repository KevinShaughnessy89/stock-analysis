import WebScraper from '../services/WebScraper.js';
import axios from 'axios';

// DATABASES
import { StockMarket_DB } from "../config/DatabaseRegistry.js"

// VY7DZFI0W1AD27KR - API KEY ALPHA VANTAGE

const fakeData = 
{
    "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "IBM",
        "3. Last Refreshed": "2024-10-23",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2024-10-23": {
            "1. open": "230.6150",
            "2. high": "233.3400",
            "3. low": "230.2600",
            "4. close": "232.2100",
            "5. volume": "5647743"
        },
        "2024-10-22": {
            "1. open": "231.9900",
            "2. high": "232.9700",
            "3. low": "230.6700",
            "4. close": "232.2500",
            "5. volume": "3180807"
        },
        "2024-10-21": {
            "1. open": "231.2100",
            "2. high": "232.4200",
            "3. low": "230.2600",
            "4. close": "231.7500",
            "5. volume": "2733336"
        },
        "2024-10-18": {
            "1. open": "231.9200",
            "2. high": "232.6499",
            "3. low": "230.1700",
            "4. close": "232.2000",
            "5. volume": "4715688"
        }
    }
}

const COLLECTION_NAME_DAILY = 'daily_price';    
const STOCK_SYMBOLS = ['MMM', 'MSI'];
const API_KEY = 'VY7DZFI0W1AD27KR';
const BASE_URL = 'https://www.alphavantage.co/query?'

const webScraper = new WebScraper();

export async function updateStockData() {
    console.log("updating stock...")
    try {
        for (let symbol of STOCK_SYMBOLS) {
            console.log("getting stock data for:", symbol);
            const result = await getStockData(symbol);
            if (result) {
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

async function getSPIndex() {
    try {
        let data = await webScraper.getAllClassText("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies", 'td .external.text')
        console.log("SP COMPANIES:", data);
        return data;
    } catch (error) {
        console.error("Error here: ", error);
        throw error;
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
        return response.data;
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