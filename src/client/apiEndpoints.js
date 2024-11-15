import { useAuthStore } from "./authStore.js";
// import dotenv from "dotenv"; - Might be needed to fix compilation error

const DOMAIN = 'https://kevinshaughnessy.ca'

export const apiEndpoints = {
    getPriceData: { // Define endpoint base configuration
        method: 'GET',
        baseURL: `${DOMAIN}`,
        endpoint: '/api/data/prices',
        headers: {
            'Content-Type': 'application/JSON'
        },
        params: {
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
    getPriceAverage: {
        method: 'GET',
        baseURL: DOMAIN,
        endpoint: '/api/data/prices/average',
        headers: {
            'Content-Type': 'applications/JSON'
        },
        params: {
            symbol: true,
            startDate: true,
            endDate: true
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
            api_key: process.env.RSS_KEY,
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
                useAuthStore.getState().setIsAuthenticated(true);
                return response.success;
            }
        }
    },
    logoutUser: {
        method: 'POST',
        baseURL: DOMAIN,
        endpoint: '/api/user/logout',
        responseHandlers: {
            200: (response) => {
                useAuthStore.getState().setIsAuthenticated(false);
            }
        }
    },
    verifyCookie: {
        method: 'GET',
        baseURL: DOMAIN,
        endpoint: '/api/auth/verify',
        optional: {
            credentials: 'include'
        },
        responseHandlers: {
            200: (response) => {
                useAuthStore.getState().setIsAuthenticated(true);
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
            apikey:  process.env.ALPHA_VANTAGE_KEY,
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