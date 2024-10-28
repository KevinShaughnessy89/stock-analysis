import React, { useEffect, useState, useRef } from 'react';
import { getPriceData } from './apis.js'
import StockLineChart from './StockLineChart.js';
import GraphController from './GraphController.js';

const DEFAULT_SYMBOL = 'MSI';
const DEFAULT_START_DATE = '2024-10-15T00:00:00.000Z';
const DEFAULT_END_DATE = '2024-10-17T00:00:00.000Z';

const StockAnalysis = () => {

    const isFirstRender = useRef(true);

    const [symbol, setSymbol] = useState("");
    const [priceData, setPriceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (isFirstRender.current === true) {
            isFirstRender.current = false;
            return;
        }

        if (symbol === "") {
            setIsLoading(true);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getPriceData(symbol, DEFAULT_START_DATE, DEFAULT_END_DATE);
                setPriceData(data);
            } catch (error) {
                setError('Failed to fetch price data');
                setPriceData([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();

    }, [symbol]);

    // if (isLoading) {
    //     return <div><h2>Loading...</h2></div>;
    //   }

    return (
        <div className='min-h-screen bg-background text-foreground dark'>
            <GraphController onSymbolSelect={setSymbol} selectedSymbol={symbol} />
            {isLoading && <div><h2>Waiting for a selection.</h2></div>} 
            {!isLoading && <div><StockLineChart selectedPriceData={priceData} /></div>} 
        </div>
    );
}

export default StockAnalysis;