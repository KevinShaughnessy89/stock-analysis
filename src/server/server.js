import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import cron from 'node-cron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRouter from "./routes/User_Endpoints.js";
import { setUpDatabase } from './config/DatabaseRegistry.js';
import { updateStockData } from './domain/stockData.js';

// Constants and configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = 'mongodb://0.0.0.0:27017/...';
const PORT = process.env.PORT || 5000;
dotenv.config();

// Express app initialization
const app = express();

// Configure middleware
function setupMiddleware(app) {
    // Request logging
    app.use((req, res, next) => {
        console.log(`Received request: ${req.method} ${req.url}`);
        next();
    });

    // Basic middleware
    app.use(express.json());
    app.use(express.static(join(__dirname, '..', '..', 'build')));
    app.use(cors({
        origin: [
            'https://localhost:3000', 
            'https://localhost:5000',
            'https://35.208.160.118',
            'https://kevinshaughnessy.ca'
		]
    }));

    // Error handling middleware (should be last)
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });
}

function setupRouting(app) {
        // Routes
        app.use('/api', userRouter);
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
    cron.schedule('0 18 * * *', async () => {
        try {
            console.log('Updating stock price data...');
            await updateStockData();
            console.log('Update complete.');
        }
        catch (error) {
            console.error('Error updating stock price: ', error);
        }
    })
}

// Main initialization function
async function initialize() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB.");

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

        // Initialize database and start stock updates
        await setUpDatabase(client);

    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

// Start the server
initialize();
