import axios from 'axios'

const api = axios.create({
    baseURL: 'https://kevinshaughnessy.ca/api'
  });
  
  export async function getPriceData(symbol, startDate, endDate) {
    try {
        const response = await api.get('/data/chart', {
            params: {
                symbol: symbol,
                startDate: startDate,
                endDate: endDate
            }
        });

        let finalOutput = [{
            id: "stockPrice",
            data: response.data.map(item => ({
                x: new Date(item.timestamp),
                y: item.high
            
            })
        )}];

        console.log("Final output: ", finalOutput);

        return finalOutput;

    }
    catch (error) {
      // More detailed error logging
      console.error({
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.response?.data,
        // Full error object
        fullError: JSON.stringify(error, null, 2)
      });
      throw error;
    }
  }

export async function getSymbols() {
  try {
    const response = await api.get('/data/symbols');
    return response.data;
  } catch (error) {
    console.error("Error fetching stock symbols: ", error);
  }
}