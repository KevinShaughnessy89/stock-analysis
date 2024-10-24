import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env'});

async function main() {
    let client;
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found in environment variables');
            return;
        }

        client = await MongoClient.connect(process.env.MONGODB_URI)

        const command = process.argv[2];
        const dbName = process.argv[3];
        const option = process.argv[4];

        switch (command) {
            case 'deldb':
                await deleteDatabase(dbName, client);
                break;
            case 'delcoll':
                console.log('Executing delC command...');  // Debug log
                await deleteCollection(dbName, option, client)
                break;
            case 'viewall':
                await viewDatabases(dbName, client)
                break; 
        }

        return;

    } catch (error) {
        console.error("Error: ", error)
    } finally {
        await client.close();
    }
}

async function deleteDatabase(dbName, client) {
    console.log(`Deleting database ${dbName}...`);
    const db = client.db(dbName);
    await db.dropDatabase();
    console.log("Database successfully deleted.");
    await client.close();
}

async function deleteCollection(dbName, collectionName, client) {
    console.log(`Deleting collection ${collectionName} from ${dbName}...`);
    const dbs = await client.db().admin().listDatabases();
    console.log("Available databases:", dbs.databases.map(db => db.name));
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

    await collection.drop();
    console.log("Collection deleted.");
}

async function viewDatabases(dbName, client) {
    console.log(`Databases:`);
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    dbs.databases.forEach(db => {
        console.log(` - ${db.name}`)
    });
}

main().catch(console.error);