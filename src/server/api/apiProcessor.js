import { makeApiCall } from "../../common/makeApiCall.js";
import { config } from "dotenv";
import { financialApis } from "./financialApis.js";
import { StockMarket_DB } from "../config/DatabaseRegistry.js";

class APIProcessor {
    constructor(db) {
        this.db = db;
        this.results = {
            successful: [],
            failed: []
        }
        console.log("APIProcessor initialized with empty results:", this.results);
    }

    async fetchAndStore(apiName, apiConfig) {
        console.log(`\n====== Starting fetchAndStore for API: ${apiName} ======`);
        console.log("API Configuration:", apiConfig);

        try {
            for (const symbol of apiConfig.symbols) {
                console.log(`\nProcessing symbol: ${symbol}`);

                const params = Object.keys(apiConfig.params).reduce((acc, key) => {
                    acc[key] = symbol;
                    return acc;
                }, {});
                console.log("Constructed API parameters:", params);

                console.log("Making API call with config:", {
                    method: apiConfig.method,
                    params: params
                });
                const response = await makeApiCall(apiConfig, params);
                console.log("API response received:", {
                    data: JSON.stringify(response)
                });

                // TRANSFORM DATA
                console.log("Starting data transformation...");
                const transformedData = apiConfig.transform ? apiConfig.transform(response) : response;
                console.log("Data transformation complete. Sample:",
                    JSON.stringify(transformedData).substring(0, 200) + "...");

                console.log(`Inserting data into collection: ${apiConfig.collection}`);
                if (apiConfig.model) {
                    await apiConfig.model.insertMany(transformedData);
                }
                console.log("Database insertion successful");

                this.results.successful.push(apiName);
                console.log(`Added ${apiName} to successful results:`, this.results.successful);
            }
        }
        catch (error) {
            console.error(`\n⚠️ Error in fetchAndStore for ${apiName}:`, error);
            console.log("Stack trace:", error.stack);

            this.results.failed.push({
                apiName,
                error: error.message,
                timestamp: new Date()
            });
            console.log("Updated failed results:", this.results.failed);
        }
        finally {
            console.log(`====== Completed fetchAndStore for API: ${apiName} ======\n`);
        }
    }

    async run() {
        console.log("\n🚀 Starting API Processor run...");
        console.log("Available APIs:", Object.keys(financialApis));

        try {
            for (const [apiName, apiConfig] of Object.entries(financialApis)) {
                console.log(`\n📌 Processing API: ${apiName}`);
                await this.fetchAndStore(apiName, apiConfig);
                console.log(`✅ Completed processing for ${apiName}`);
            }

            console.log("\n====== API Processing Summary ======");
            console.log("Successful APIs:", this.results.successful);
            console.log("Failed APIs:", this.results.failed);
            console.log("Total processed:",
                this.results.successful.length + this.results.failed.length);
            console.log("Success rate:",
                `${(this.results.successful.length / (this.results.successful.length + this.results.failed.length) * 100).toFixed(2)}%`);
        }
        catch (error) {
            console.error("\n🚨 Critical error in API Processor:", error);
            console.error("Stack trace:", error.stack);
        }
        finally {
            console.log("\n====== API Processor run complete ======");
        }
    }
}

export default APIProcessor;