import { ResponsiveLine } from '@nivo/line'
import { useEffect, useState } from 'react'
import { timeFormat } from 'd3-time-format'

const DEFAULT_SYMBOL = 'MMM';
const DEFAULT_START_DATE = '2024-10-15T00:00:00.000Z';
const DEFAULT_END_DATE = '2024-10-17T00:00:00.000Z';

const StockLineChart = ({ selectedPriceData }) => {
    
    return (
        <div>
            <div style={{ height: '300px' }}>
                <ResponsiveLine
                    data={selectedPriceData}
                    margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                    curve="natural"
                    enableArea={true}
                    enablePoints={false}
                    useMesh={true}
                    xScale={{
                      type: 'time',
                      precision: 'day'
                    }}
                    yScale={{
                      type: 'linear',
                      min: 'auto',
                      max: 'auto'
                    }}
                    axisBottom={{
                      tickSize: 10,
                      tickValues: 5,
                      tickPadding: 5,
                      format: (value) => {
                        if (!value) return '';
                        const date = new Date(value);
                        return date instanceof Date && !isNaN(date) 
                          ? date.toLocaleDateString() 
                          : '';
                      },
                      tickRotation: 0,
                      legend: 'Day',
                      legendOffset: 36,
                      legendPosition: 'middle'
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Price',
                      legendOffset: -40,
                      legendPosition: 'middle'
                    }}
                />
            </div>
            <div>
                <p>This is a placeholder.</p>
            </div>
        </div>
    )
}

export default StockLineChart