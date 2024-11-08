import { makeDetailedApiCall } from "../common/makeApiCall";
import { StockMarket_DB } from "../server/config/DatabaseRegistry";

const COLLECTION_NAME = 'news_sentiment';

async function calculateOverallSentimentScore(symbol, startDate, endDate) {

    const data = StockMarket_DB.findDocuments(COLLECTION_NAME, {
        symbol: symbol
    });

    const matchStage = {
        symbol: symbol,
        time_published: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }

    const groupStage = {
        _id: {
            symbol: "$symbol",
        },
        averageSentiment: {
            $avg: "$overall_sentiment_score"
        }
    }

    const aggregate = [matchStage, groupStage];
    const result = await news_sentiment.aggregate(aggregate).toArray();

    return result.overall_sentiment_score;
}

async function calculateTickerSentiment(symbol, startDate, endDate) {


    const matchStage = {
        symbol: symbol,
        time_published: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }
    const unwindStage = {
        $unwind: 'ticker_sentiment'
    }

    const groupStage = {
        _id: '$symbol',
        average_sentiment: {
            $avg: '$ticker_sentiment.ticker_sentiment_score'
        },
        average_relevance: {
            $avg: '$ticker_sentiment.relevance_score'
        }
    }

    const result = await StockMarket_DB.aggregate([matchStage, unwindStage, groupStage]).toArray()

    return result;
}