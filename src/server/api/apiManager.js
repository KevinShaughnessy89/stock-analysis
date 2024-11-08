import APIProcessor from "./apiProcessor.js";
import { StockMarket_DB } from "../config/DatabaseRegistry.js";

export async function updateDatabase() {
    try {
        const processor = new APIProcessor(StockMarket_DB.getDb());
        await processor.run();
    }
    catch (error) {
        console.error("Error updating database: ", error);
    }
}