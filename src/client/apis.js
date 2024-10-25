import axios from 'axios'

const api = axios.create({
    baseURL: 'http://kevinshaughnessy.ca'
});

export async function getPriceData(symbol, startDate, endDate) {
    try {
        const response = await api.get('/api/data/chart', {
            params: {
                symbol : symbol,
                startDate: startDate,
                endDate: endDate
            }
        });
        console.log("Returning data: ", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error getting price data: ", error);
    }
}