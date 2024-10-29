import React, { useEffect, useState, useRef } from 'react';
import { getPriceData } from './apis.js'
import StockLineChart from './StockLineChart.js';
import SymbolSelector from './SymbolSelecter.js';
import GraphCalender from './GraphCalender.js';
import { isValid } from "date-fns";

const DEFAULT_START_DATE = '2024-10-15T00:00:00.000Z';
const DEFAULT_END_DATE = '2024-10-17T00:00:00.000Z';

const StockAnalysis = () => {

    const isFirstRender = useRef(true);

    const [symbol, setSymbol] = useState("");
    const [startDate, setStartDate] = useState(new Date(DEFAULT_START_DATE));
    const [endDate, setEndDate] = useState(new Date(DEFAULT_END_DATE));
    const [graphState, setGraphState] = useState({
        isValid: false,
        priceData: []
    });

    useEffect( () => {

        if (symbol === "" || !isValid(startDate) || !isValid(endDate)) {
            setGraphState({
                isValid: false,
                priceData: []
            });
        }

        if (symbol !== "" && isValid(startDate) && isValid(endDate)) {
            const fetchData = async () => {
                try {
                    const data = await getPriceData(symbol, startDate, endDate);
                    setGraphState({
                        isValid: true,
                        priceData: data
                    });                
                } catch (error) {
                    console.error("Failed to fetch price data: ", error);
                }
            }

            fetchData();

        }
    }, [symbol, startDate, endDate])

    return (
        <div className='min-h-screen bg-background text-foreground dark'>
            <SymbolSelector onSymbolSelect={setSymbol} selectedSymbol={symbol} />
            <GraphCalender onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
            <StockLineChart graphState={graphState} />
        </div>
    );
}

export default StockAnalysis;