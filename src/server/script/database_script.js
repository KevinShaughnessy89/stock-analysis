import { spawn } from 'child_process';
import { StockMarket_DB } from '../config/DatabaseRegistry.js';
import fs from 'fs';
import { calculateAverage } from '../statistics/processPriceData.js'

export async function runPython(symbol, startDate, endDate) {

    // GET DATA
    const data = await calculateAverage(symbol, startDate, endDate);

    await fs.writeFile('temp-data.json', JSON.stringify(data));

    const pythonProcess = spawn('python3', ['python.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log("Python output: ", data);
    })
}