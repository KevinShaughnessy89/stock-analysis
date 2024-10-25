import { ResponsiveLine } from '@nivo/line'
import { useEffect, useState } from 'react'
import { getPriceData } from './apis.js';
import { timeFormat } from 'd3-time-format'

const DEFAULT_SYMBOL = 'MMM';
const DEFAULT_START_DATE = '2024-10-15T00:00:00.000Z';
const DEFAULT_END_DATE = '2024-10-17T00:00:00.000Z';

const MinimalLineChart = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const results = await getPriceData(DEFAULT_SYMBOL, DEFAULT_START_DATE, DEFAULT_END_DATE);
          setData(results);
          setLoading(false);
        } catch (error) {
          setError(error);
          console.log("Error displaying graph: ", error);
        }
      };
  
      fetchData();
    }, []);
  
    // Add conditional rendering
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!data) {
      return <div>No data!</div>
    }

    console.log("7. Rendering, data is:", data);  // This will run multiple times
    
    return (
        <div>
            <div style={{ height: '300px' }}>
                <ResponsiveLine
                    data={data}
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
                      format: (value) => new Date(value).toLocaleDateString(),
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

export default MinimalLineChart