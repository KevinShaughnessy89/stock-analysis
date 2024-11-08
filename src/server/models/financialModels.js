import mongoose from 'mongoose';
import validator from 'validator';

const SentimentArticleSchema = new mongoose.Schema(
    {
        title: String,
        url: String,
        time_published: {
            type: String,
            required: true,
            index: true
        },
        topics: [{
            topic: String,
            relevance_score: Number
        }],
        overall_sentiment_score: {
            type:Number,
        },
        ticker_sentiment: [{
            ticker: {
                type: String,
                uppercase: true
            },
            relevance_score: Number,
            ticker_sentiment_score: Number
        }],
    }, 
    { 
        timestamp: true,
        strict: true
     }
)

export const SentimentSchema = mongoose.model('Sentiment_Article', SentimentArticleSchema);

const PriceSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    symbol: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
});

export const PriceDataSchema = mongoose.model('Price_Data', PriceSchema);