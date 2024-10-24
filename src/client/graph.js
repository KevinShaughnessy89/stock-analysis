import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const StockChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const fetchData = async () => {

        }

        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'March'],
                datasets: [{
                    label: 'Monthly Sales',
                    data: [100, 200, 300],
                    borderColor: 'rbg(255, 0, 0)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Sales Chart'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        }
    }, []);

    return (
        <div style={{width: "100%", maxWidth: "600px"}}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default StockChart;