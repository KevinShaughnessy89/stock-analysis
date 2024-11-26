import { spawn } from "child_process";
import fs from "fs";
import { StockMarket_DB } from "../config/DatabaseRegistry.js";
import queryConfigs from "../config/stockQueryConfigs.js";

export async function runPythonScript(filepath) {
	console.log("Starting Python process...", filepath);

	return new Promise((resolve, reject) => {
		try {
			console.log("Spawning Python process...");
			const pythonProcess = spawn("python3", [filepath], {
				stdio: ["pipe", "pipe", "pipe"],
				shell: true, // Try with shell true to ensure proper path resolution
			});

			let output = "";
			let errorOutput = "";

			console.log("Setting up event listeners...");

			pythonProcess.stdout.on("data", (data) => {
				console.log("Python stdout:", data.toString());
				output += data.toString();
			});

			pythonProcess.stderr.on("data", (data) => {
				console.log("Python stderr:", data.toString());
				errorOutput += data.toString();
			});

			// Handle process exit
			pythonProcess.on("exit", (code, signal) => {
				console.log(
					`Python process exited with code ${code} and signal ${signal}`
				);
				if (code === 0) {
					resolve(output);
				} else {
					reject(
						new Error(
							`Process exited with code ${code}: ${errorOutput}`
						)
					);
				}
			});

			// Handle process error
			pythonProcess.on("error", (err) => {
				console.error("Python process error:", err);
				reject(
					new Error(`Failed to start Python process: ${err.message}`)
				);
			});

			// Handle process termination
			pythonProcess.on("close", (code) => {
				console.log("Python process closed with code:", code);
				if (code === 0 && !pythonProcess.killed) {
					resolve(output);
				}
			});

			// Set a timeout to kill the process if it takes too long
			const timeout = setTimeout(() => {
				console.log("Python process timed out");
				pythonProcess.kill();
				reject(new Error("Python process timed out after 30 seconds"));
			}, 30000);

			// Clear the timeout if the process finishes
			pythonProcess.on("close", () => {
				clearTimeout(timeout);
			});

			// Handle uncaughtException
			process.on("uncaughtException", (err) => {
				console.error("Uncaught Exception:", err);
				pythonProcess.kill();
				reject(new Error(`Uncaught exception: ${err.message}`));
			});
		} catch (error) {
			console.error("Error in runPythonScript:", error);
			reject(error);
		}
	});
}

export async function getAdvancedStatistics(symbol, startDate, endDate) {
	console.log("Starting getAdvancedStatistics...");
	try {
		console.log("Writing data to file...");
		await writeDataToFile(symbol, startDate, endDate);

		console.log("Running Python script...");
		const result = await runPythonScript(
			"/home/kevinshaughnessy89/Projects/stock-analysis/src/server/script/python.py"
		);

		console.log("Completed Python script with data:", result);
		return JSON.parse(result);
	} catch (error) {
		console.error("Error in getAdvancedStatistics:", error);
		throw error;
	} finally {
		console.log("getAdvancedStatistics completed");
	}
}

export async function writeDataToFile(symbol, startDate, endDate) {
	// GET DATA
	const data = await StockMarket_DB.query(queryConfigs.rawPriceData, {
		symbol: symbol,
		$gte: new Date(startDate),
		$lte: new Date(endDate),
	});
	console.log("data: ", JSON.stringify(data[0].allData));
	fs.writeFileSync("./temp-data.json", JSON.stringify(data[0].allData));
	fs.readFile("./temp-data.json", "utf8", (err, data) => {
		if (err) {
			console.error("Error reading the file:", err);
			return;
		}
		let cleanedData = data.replace(/[\x00-\x1F\x7F]/g, ""); // Remove non-printable characters (if any)
		try {
			const jsonData = JSON.parse(cleanedData); // Parse the JSON to make sure it's valid
			cleanedData = JSON.stringify(jsonData, null, 2); // Pretty-print again
		} catch (parseError) {
			console.error("Error parsing JSON:", parseError);
		}
		fs.writeFileSync("./temp-data-cleaned.json", cleanedData);
	});
}
