import {MongoClient} from 'mongodb';

class Database {

    constructor(databaseName) {
        this.client = null;
        this.db = null;
        this.databaseName = databaseName;
    }

    async connect() {
    if (!this.client) {
        const uri = process.env.DATABASE_URL;
        console.log("URI:", process.env.DATABASE_URL);  // Add this before MongoClient
        this.client = new MongoClient(uri);

        try {
            await this.client.connect();
            this.db = this.client.db(this.databaseName);
            console.log(`Connected to MongoDB database: ${this.databaseName}`);
        } catch (error) {
            console.log("Error connecting to MongoDB: ", error);
            throw error;
        }
        } else {
            console.log("Using existing database connection");        
        }

        return this.db;
    }

    async databaseExists() {
        try {
            await this.connect();
            const dbs = await this.db.admin().listDatabases();
            return dbs.databases.some(db => db.name === this.databaseName);
        }
        catch (error) {
            console.error("Error checking if database exists: ", error);
        }
    }

    async setupDatabase(params) {
        try {
            await this.connect();

            await Promise.all(
                params.map(async ({collectionName, timeSeriesParams}) => {
                    try {
                        await this.db.createCollection(collectionName, timeSeriesParams);
                        console.log(`Created collection: ${collectionName}`);
                    }
                    catch (error) {
                        console.error(`Error creating collection ${collectionName}`);
                        throw error;
                    }
                }));
        }
        catch (error) {
            console.error(`Error creating database ${this.databaseName}: `, error);
        }
    }

    getDb() {
        return this.client.db(this.databaseName);
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            console.log("MongoDB connection closed.");
        }
    }

    async createTimeSeriesCollection(collectionName, params) {
        try {
            const result = await this.db.createCollection(collectionName, params)
            return result;
        }
        catch (error) {
            console.error('Error creating time series collection: ', error);
        }
    }

    async insertDocuments(collectionName, docs) {
        try {
            const collection = this.db.collection(collectionName);
            const insert = async (documents) => {

                let results = {
                    inserted: 0,
                    duplicates: 0,
                    error: []
                };

                for (let doc of documents) {
                    try {
                        const existingRecord = await collection.findOne( {
                            timestamp: doc.timestamp,
                            symbol: doc.symbol
                    });
                        if (existingRecord) {
                            results.duplicates++;
                            console.log("Duplicate document detected.");
                        } else {
                            await collection.insertOne(doc);
                            results.inserted++;
                            console.log(`inserted document in ${collection}`)
                        }
                    }
                    catch (err) {
                        results.error.push({
                            doc: doc,
                            error: err.message
                        })
                    }
                }
                    return results;
            }
            let finalResult;
            if (Array.isArray(docs)) {
                finalResult = await insert(docs);
            } else {
                finalResult = await insert([docs]);
            }

            return finalResult;
        } 
        catch (error) {
            console.error("Error inserting document in ", collectionName);
            throw error;
        }
    }

    async findDocuments(collectionName, query = {}, options = {}) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.find(query, options).toArray();
        } catch (error) {
            console.error("Error finding document in", collectionName, " with query: ", query);
            throw error;
        }
    }

    async updateDocuments(collectionName, filter, update, options = {}) {
        try {
            const collection = this.db.collection(collectionName);
            if (options.many) {
                return await collection.updateMany(filter, update, options);
            } else {
                return await collection.updateOne(filter, update, options);
            }
        } catch (error) {
            console.error("Error updating document in collection: ", collectionName);
            throw error;
        }
    }

    async deleteDocuments(collectionName, filter, options = {}) {
        try {
            const collection = this.db.collection(collectionName);
            if (options.many) {
                return await collection.deleteMany(filter, options);
            } else {
                return await collection.deleteOne(filter, options);
            }
        } catch (error) {
            console.error("Error deleting document(s) in collection: ", collectionName);
        }
    }

    async query(queryConfig, params = {}) {

        const updateFields = () => {

            return (
                queryConfig.params.map((stage) => {
                    
                    Object.entries(params).forEach(([key, value]) => {
                        if (key in queryConfig.pipeline) {
                            stage[key] = value;
                        }
                    })
              }
            ))
        }
    }
}

export default Database;
