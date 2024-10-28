import React, { useEffect, useState, useRef } from 'react';
import { getPriceData } from './apis.js'
import StockLineChart from './StockLineChart.js';
import GraphController from './GraphController.js';
import '../index.css'

const DEFAULT_SYMBOL = 'MSI';
const DEFAULT_START_DATE = '2024-10-15T00:00:00.000Z';
const DEFAULT_END_DATE = '2024-10-17T00:00:00.000Z';

const StockAnalysis = () => {

    const isFirstRender = useRef(true);

    const [symbol, setSymbol] = useState('Select A Symbol');
    const [priceData, setPriceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        if (isFirstRender.current === true) {
            isFirstRender.current = false;
            return;
        }

        const fetchData = async () => {
            try {
                console.log("FEFDFDA");
                setIsLoading(true);
                const data = await getPriceData(symbol.value, DEFAULT_START_DATE, DEFAULT_END_DATE);
                console.log('do we get here');
                setPriceData(data);
            } catch (error) {
                setError('Failed to fetch price data');
                setPriceData([]);
            } finally {
                setIsLoading(false);
                console.log("What about here, ", isLoading);
            }
        }

        fetchData();

    }, [symbol]);

    // if (isLoading) {
    //     return <div><h2>Loading...</h2></div>;
    //   }

    return (
        <div className='bg-gray-900'>
            <GraphController onSymbolSelect={setSymbol} selectedSymbol={symbol} />
            {isLoading && <div><h2>Loading...</h2></div>} 
            {!isLoading && <div><StockLineChart selectedPriceData={priceData} /></div>} 
        </div>
    );
}

export default StockAnalysis;