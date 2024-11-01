import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const localApi = axios.create({
    baseURL: 'https://kevinshaughnessy.ca/api'
  });
  
export async function getRSS(url) {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json', {
      params: {
        rss_url: url,
        api_key: 'tvlifvtazfbwrh0i26jwpm2ovnc1bwmxzkoyvqus',
        count: 20
      }
    });

    return response.data;
    }
    catch (error) {
      console.error("Error getting RSS feed: ", error);
    }
  }

export async function registerUser(formData) {
  try {
    const response = await localApi.post('/user/register', formData);
    console.log("Creating user with data: ", formData);
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

export async function loginUser(formData) {
  try {
    console.log("Sending POST request in loginUser")
    const response = await localApi.post('/user/login', formData);
    console.log("POST request complete", formData.username);

    if (response.success) {
      console.log("data was successfully sent");
      localStorage.setItem('token', response.token);
      return response.success;
    }
  }
  catch (error) {
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
    return false;
  }
}


export async function getUserInfo(fields) {
  try {
    console.log("In getUserInfo");

    const params = new URLSearchParams({
      fields: fields.join(',')
    })
    console.log("Created params");
    const response = await localApi.get(`user/info?${params}`, {
      credentials: 'include',
      // Add this to see what cookies are being sent
      headers: {
        'Accept': 'application/json'
      } 
    });
    console.log("Got a response")
    
    return response.data;
  }
  catch (error) {
    console.error("Error getting user info: ", error);
    
  }
}

  export async function scrapeWebsite(url) {
    try {
      const response = await localApi.post('/scrape', {
          url: url
      });

      return response.data;
    }
    catch (error) {
      console.error("Error scraping website: ", error);
    }
  }


  export async function getPriceData(symbol, startDate, endDate) {
    try {
        const response = await localApi.get('/data/chart', {
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
    const response = await localApi.get('/data/symbols');
    return response.data;
  } catch (error) {
    console.error("Error fetching stock symbols: ", error);
  }
}

export async function queryNews(request) {
  try {
    
    const response = await localApi.get('/data/news', {
     topic: request
    });

    return response.data;
  }
  catch (error) {
    console.error("Error queries news endpoint: ", error);
  }
}