import { useAuthStore } from "./authStore.js";

const DOMAIN =
	process.env.REACT_APP_ENV === "development"
		? "http://localhost:5000"
		: "https://kevinshaughnessy.ca";

export const apiEndpoints = {
	getPriceData: {
		// Define endpoint base configuration
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/data/prices",
		headers: {
			"Content-Type": "application/JSON",
		},
		params: {
			startDate: true,
			endDate: true,
			symbol: true,
		},
		responseHandlers: {
			200: (response) => {
				let finalOutput = [
					{
						id: "stockPrice",
						data: response.data.map((item) => ({
							x: new Date(item.timestamp),
							y: item.high,
						})),
					},
				];
				return finalOutput;
			},
		},
	},
	getPriceAverage: {
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/data/prices/average",
		headers: {
			"Content-Type": "applications/JSON",
		},
		params: {
			symbol: true,
			startDate: true,
			endDate: true,
		},
	},
	getRSS: {
		method: "GET",
		baseURL: "https://api.rss2json.com",
		endpoint: "/v1/api.json",
		headers: {
			"Content-Type": "applications/JSON",
		},
		params: {
			rss_url: true,
		},
		appendParams: {
			api_key: process.env.RSS_KEY,
			count: 10,
		},
	},
	registerUser: {
		method: "POST",
		baseURL: DOMAIN,
		endpoint: `/api/user/register`,
		data: {
			username: true,
			password: true,
			confirmPassword: true,
			email: true,
		},
	},
	loginUser: {
		method: "POST",
		baseURL: DOMAIN,
		endpoint: `/api/user/login`,
		data: {
			username: true,
			password: true,
		},
	},
	logoutUser: {
		method: "POST",
		baseURL: DOMAIN,
		endpoint: "/api/user/logout",
	},
	verifyCookie: {
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/user/auth/verify",
		optional: {
			credentials: "include",
		},
	},
	getUserInfo: {
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/user/info",
		params: {
			fields: true,
		},
		optional: {
			credentials: "include",
		},
		responseHandlers: {
			200: (response) => {
				return response.userInfo;
			},
		},
	},
	scrapeWebsite: {
		method: "POST",
		baseURL: DOMAIN,
		endpoint: "/api/scrape",
		data: {
			url: true,
		},
	},
	getStockSymbols: {
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/data/symbols",
		params: {},
	},
	queryNews: {
		method: "GET",
		baseURL: "https://www.alphavantage.co?",
		endpoint: "/query",
		params: {
			topics: true,
			tickers: true,
			function: true,
		},
		appendParams: {
			apikey: process.env.ALPHA_VANTAGE_KEY,
		},
	},
	getUserPreferences: {
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/user/preferences",
		params: {},
		optional: {
			credentials: "include",
		},
	},
	saveFeedItem: {
		method: "POST",
		baseURL: DOMAIN,
		endpoint: "/api/user/feed",
		data: {
			title: true,
			link: true,
			source: true,
			description: true,
		},
		optional: {
			credentials: "include",
		},
	},
	getChatHistory: {
		method: "GET",
		baseURL: DOMAIN,
		endpoint: "/api/chat/history",
		params: {},
	},
	saveChatHistory: {
		method: "POST",
		baseURL: DOMAIN,
		endpoint: "/api/chat/history",
		data: {
			username: true,
			entry: true,
			timestamp: true,
		},
	},
};
