import React, { useEffect, useState } from "react";
import StockLineChart from "./StockLineChart.js";
import SymbolSelector from "./SymbolSelecter.js";
import StockStats from "./StockStats.js";
import GraphCalender from "./GraphCalender.js";
import { isValid } from "date-fns";
import { makeApiCall } from "../common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import PythonStats from "./PythonStats.js";

const DEFAULT_START_DATE = "2024-10-15T00:00:00.000Z";
const DEFAULT_END_DATE = "2024-10-17T00:00:00.000Z";

const StockAnalysis = () => {
	const [symbol, setSymbol] = useState("");
	const [startDate, setStartDate] = useState(new Date(DEFAULT_START_DATE));
	const [endDate, setEndDate] = useState(new Date(DEFAULT_END_DATE));
	const [graphState, setGraphState] = useState({
		isValid: false,
		priceData: [],
		averages: {},
		python: [],
	});

	useEffect(() => {
		if (symbol === "" || !isValid(startDate) || !isValid(endDate)) {
			setGraphState({
				isValid: false,
				priceData: [],
				averages: {},
				python: [],
			});
		}

		if (symbol !== "" && isValid(startDate) && isValid(endDate)) {
			const fetchData = async () => {
				try {
					const graphResults = await makeApiCall(
						apiEndpoints.getPriceData,
						{
							symbol: symbol,
							startDate: startDate,
							endDate: endDate,
						}
					);
					const statisticsResults = await makeApiCall(
						apiEndpoints.getPriceAverage,
						{
							symbol: symbol,
							startDate: startDate,
							endDate: endDate,
						}
					);

					setGraphState({
						isValid: true,
						priceData: graphResults,
						averages: statisticsResults.averages,
						python: statisticsResults.statistics,
					});
				} catch (error) {
					console.error("Failed to fetch price data: ", error);
				}
			};

			fetchData();
		}
	}, [symbol, startDate, endDate]);

	return (
		<div className="min-h-screen bg-background flex flex-col text-foreground  w-full h-full">
			<SymbolSelector
				onSymbolSelect={setSymbol}
				selectedSymbol={symbol}
			/>
			<GraphCalender
				onStartDateChange={setStartDate}
				onEndDateChange={setEndDate}
			/>
			<StockLineChart graphState={graphState} />
			<div className="flex flex-row w-full">
				<StockStats symbol={symbol} graphState={graphState} />
				<PythonStats graphState={graphState} />
			</div>
		</div>
	);
};

export default StockAnalysis;
