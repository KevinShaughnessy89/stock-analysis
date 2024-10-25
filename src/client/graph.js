import { ResponsiveLine } from '@nivo/line'
import { useEffect, useState } from 'react'
import { getPriceData } from './apis.js';

const DEFAULT_SYMBOL = 'MSI';
const DEFAULT_START_DATE = '2024-06-01T00:00:00.000Z';
const DEFAULT_END_DATE = '2024-06-10T00:00:00.000Z';

const MinimalLineChart = () => {
    console.log("1. Component starting");  // First
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
  
    console.log("2. After useState");  // Second
  
    useEffect(() => {
      console.log("3. useEffect starting");  // Third
      const fetchData = async () => {
        console.log("4. fetchData starting"); // Fourth
        try {
          console.log("5. Before API call"); // Fifth
          const results = await getPriceData(DEFAULT_SYMBOL, DEFAULT_START_DATE, DEFAULT_END_DATE);
          console.log("6. API returned:", results); // Sixth
          setData(results);
        } catch (error) {
          console.log("Error:", error); // If there's an error
          setError(error);
        }
      };
  
      fetchData();
    }, []);
  
    console.log("7. Rendering, data is:", data);  // This will run multiple times
  

    return (
        <div>
            <div style={{ height: '300px' }}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    axisBottom={null}
                    axisLeft={null}
                />
            </div>
            <div>
                <p>{JSON.stringify(data)}</p>
            </div>
        </div>
    )
}

export default MinimalLineChart