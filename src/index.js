import React from 'react';
import ReactDOM from 'react-dom/client';
import StockAnalysis from './client/StockAnalysis.js';
import './styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <StockAnalysis />
    </React.StrictMode>
);