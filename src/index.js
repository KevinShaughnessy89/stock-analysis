import React from 'react';
import ReactDOM from 'react-dom/client';
import LineChartDemo from './client/graph.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <h1>This is a chart:</h1>
        <LineChartDemo />
    </React.StrictMode>
);