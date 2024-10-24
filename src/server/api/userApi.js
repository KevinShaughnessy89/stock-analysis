import axios from 'axios';

const API_BASE_URI = 'https://localhost:3000/api/user';

const api = axios.create({
    baseUrl: API_BASE_URI,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

function fetchData(endpoint, params = {}) {
    return api.get(endpoint, {params})
      .then(response => response.data)
      .catch(error => {
        console.error("API GET error: ", error);
        throw error;
      })
}

export const userApi = {
    getNames: () => fetchData('/names')
}