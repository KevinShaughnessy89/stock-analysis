const DOMAIN = 'https://kevinshaughnessy.ca'

export const apiEndpoints = {
    getPriceData: { // Define endpoint base configuration
        method: 'GET',
        baseURL: `${DOMAIN}`,
        endpoint: '/api/data/prices',
        headers: {
            'Content-Type': 'application/JSON'
        },
        queryParams: {
            startDate: true,
            endDate: true,
            symbol: true
        },
        responseHandlers: {
            200: (response) => {
                let finalOutput = [{ 
                    id: "stockPrice",
                    data: response.data.map(item => ({
                        x: new Date(item.timestamp),
                        y: item.high
                    
                    })
                )}];
                return finalOutput;
            }
        }
    },
    getRSS: {
        method: 'GET',
        baseURL: 'https://api.rss2json.com',
        endpoint: '/v1/api.json',
        headers: {
            'Content-Type': 'applications/JSON'
        },
        params: {
            rss_url: true,
        },
        appendParams: {
            api_key: 'tvlifvtazfbwrh0i26jwpm2ovnc1bwmxzkoyvqus',
            count: 10
        }
    },
    registerUser: {
        method: 'POST',
        baseURL: DOMAIN,
        endpoint: `/api/user/register`,
        data: {
            username: true,
            password: true,
            confirmPassword: true,
            email: true
        }
    },
    loginUser: {
        method: 'POST',
        baseURL: DOMAIN,
        endpoint: `/api/user/login`,
        data: {
            username: true,
            password: true
        },
        responseHandlers: {
            200: (response) => {
                localStorage.setItem('token', response.token);
                return response.success;
            }
        }
    },
    getUserInfo: {
        method: 'GET',
        baseURL: DOMAIN,
        endpoint: '/api/user/info',
        params: {
            fields: true
        },
        optional: {
            credentials: 'include'
        }
    },
    scrapeWebsite: {
        method: 'POST',
        baseURL: DOMAIN,
        endpoint: '/api/scrape',
        data: {
            url: true
        }
    },
    getStockSymbols: {
        method: 'GET',
        baseURL: DOMAIN,
        endpoint: '/api/data/symbols',
        params: {

        }
    },
    queryNews: {
        method: 'GET',
        baseURL: 'https://www.alphavantage.co?',
        endpoint: '/query',
        params: {
            topics: true,
            tickers: true,
            function: true,
        },
        appendParams: {
            apikey:  'VY7DZFI0W1AD27KR',
        }
    },
    getUserPreferences: {
        method: 'GET',
        baseURL: DOMAIN,
        endpoint: '/api/user/preferences',
        params: {

        },
        optional: {
            credentials: 'include'
        }
    },
    saveFeedItem: {
        method: 'POST',
        baseURL: DOMAIN,
        endpoint: '/api/user/feed',
        data: {
            title: true,
            link: true,
            source: true,
            description: true
        },
        optional: {
            credentials: 'include'
        }
    }
}