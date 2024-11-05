import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import cron from 'node-cron';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDatabase } from './config/DatabaseRegistry.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middleware/errorHandling.js';
import { updateDatabase } from './api/apiController.js';

// Constants and configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Routers
import { routers, createEndpoints } from './routes/endpointHandler.js'

dotenv.config({ path: resolve(__dirname, '../../.env')});

// Express app initialization
const app = express();

// Configure middleware
function setupMiddleware(app) {
    // Request logging
    app.use((req, res, next) => {
        console.log('==== Incoming Request ====');
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`Method: ${req.method}`);
        console.log(`URL: ${req.url}`);
        console.log(`Headers:`, req.headers);
        console.log('========================');
        next();
    });

    // Basic middleware
    app.use(express.json({
        strict: true
    }));

    app.use(express.static(join(__dirname, '..', '..', 'build')));
    app.use(cors({
        origin: [
            'https://localhost:3000', 
            'https://localhost:5000',
            'https://35.208.160.118',
            'https://kevinshaughnessy.ca'
		]
    }));

    app.use(cookieParser());

    app.use(globalErrorHandler);
}

function setupRouting(app) {
        createEndpoints();
        app.use('/api/user', routers.userRouter.data);
        app.use('/api/data', routers.dataRouter.data);
        app.use('/api', routers.systemRouter.data);
}

// Setup process signal handlers
function setupProcessHandlers(server) {
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });
    
    process.on('SIGINT', () => {
        process.exit(0);
    });
}

async function setupSchedulers() {
    cron.schedule('* * * * *', async () => {
        try {
            console.log('Beginning scheduled update.');
            await updateDatabase();
            console.log('Scheduled update complete.');
        }
        catch (error) {
            console.error('Error updating stock price: ', error);
        }
    })
}

async function setupDatabase() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB.");

        // Connect to mongoose
        await mongoose.connect(uri);
        console.log("mongoose connected to MongoDB.");

        connectDatabase(client);
    }
    catch (error) {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
}

// Main initialization function
async function initialize() {
    try {

        setupDatabase();

        // Setup Express middleware and routes
        setupMiddleware(app);

        setupSchedulers();

        setupRouting(app);

        // Start the server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening at http://localhost:${PORT}`);
        });

        // Setup process handlers
        setupProcessHandlers(server);

    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

// Start the server
initialize();
