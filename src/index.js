import React from 'react';
import ReactDOM from 'react-dom/client';
import StockAnalysis from './client/StockAnalysis.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <h1>This is a chart:</h1>
        <StockAnalysis />
    </React.StrictMode>
);