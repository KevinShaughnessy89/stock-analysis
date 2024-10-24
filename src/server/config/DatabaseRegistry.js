import {MongoClient} from 'mongodb';
import Database from './Database.js';

const DB_NAME = 'stock_db';
const SYSTEM_FLAG = 'system_flags';

export const StockMarket_DB = new Database(DB_NAME);

const databaseParams = [ {
        collectionName: 'daily_price', 
        timeSeriesParams: { 
            timeseries: {
                timeField: 'timestamp',
                metaField: 'symbol',
                granularity: 'hours',
            }
        }
    }
]

export async function setUpDatabase(client) {
    // Daily Stock Prices
    try{
        console.log("this is being run");
        const db = client.db(DB_NAME);
        
        const setupComplete = await db.collection(SYSTEM_FLAG).findOne({_id: 'database_setup'});
        if (!setupComplete) {
            console.log("Running initial database setup...");
            await StockMarket_DB.setupDatabase(databaseParams);

            await db.collection(SYSTEM_FLAG).updateOne(
                { _id: 'database_setup'},
                { $set: {completed: true, timestamp: new Date()}},
                { upsert: true}
            );
        } else {
            console.log("Database already exists.")
        }
    }
    catch (error) {
        console.error("Error during initial database setup: ", error);
    }
}