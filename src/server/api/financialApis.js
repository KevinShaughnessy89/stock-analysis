import { SentimentSchema, PriceDataSchema } from "../models/financialModels.js";

const TOPICS = [
    'financial_markets',
]    

export const TICKERS = [
    'MMM', 'MSI', 'GD', 'EMR', 'ETN', 'SHW'
];

export const financialApis = {
    newsSentimentTickers: {
        method: 'GET',
        baseURL: 'https://www.alphavantage.co',
        endpoint: '/query?',
        params: {
            tickers: true,
        },
        appendParams: {
            apikey:  'VY7DZFI0W1AD27KR',
            function: 'NEWS_SENTIMENT',
        },
        transform: (data) => {
            return transformSentimentArticles(data);
        },
        collection: 'news_sentiment_tickers',
        symbols: TICKERS,
        model: SentimentSchema
    },
    newsSentimentTopics: {
        method: 'GET',
        baseURL: 'https://www.alphavantage.co',
        endpoint: '/query?',
        params: {
            topics: true,
        },
        appendParams: {
            apikey:  'VY7DZFI0W1AD27KR',
            function: 'NEWS_SENTIMENT',
        },
        transform: (data) => {
            return transformSentimentArticles(data);
        },
        collection: 'news_sentiment_topics',
        symbols: TOPICS,
        model: SentimentSchema
    },
    dailyPrice: {
        method: 'GET',
        baseURL: 'https://www.alphavantage.co',
        endpoint: '/query?',
        params: {
            symbol: true
        },
        appendParams: {
            apikey:  'VY7DZFI0W1AD27KR',
            function: 'TIME_SERIES_DAILY',
        },
        transform: (data) => {
            return transformPriceData(data);
        },
        collection: 'daily_price',
        symbols: TICKERS,
        model: PriceDataSchema
    }
}


function transformPriceData(data) {

    const flattenData = (data) => {
        
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
        console.log("Did we get here?");
        return flattenedData;
    }

    data = Array.isArray(data) ? data : [data]; 
    const flattenedData = data.flatMap(flattenData);    

    return flattenedData;
}

function transformSentimentArticles(data) {

    try {
        const result = data.feed.map((article) => ({
                time_published: article['time_published'],
                title: article['title'],
                url: article['url'],
                topics: article['topics'].map(({topic, relevance_score}) => ({
                    topic,
                    relevance_score
                })),
                overall_sentiment_score: article['overall_sentiment_score'],
                ticker_sentiment: article['ticker_sentiment'].map(({ticker, relevance_score, ticker_sentiment_score}) => ({
                    ticker,
                    relevance_score,
                    ticker_sentiment_score
                }))
            }));    

            return result;
    }
    catch (error) {
        console.error("Error adding sentiment articles: ", error)
    }
}