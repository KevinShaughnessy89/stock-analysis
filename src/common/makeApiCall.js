import axios from "axios";

const logApiDetails = (stage, details) => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ${stage}:`, JSON.stringify(details, null, 2));
};

export async function makeApiCall(config, params = {}, data = {}) {
	try {
		let queryParams;
		if (["GET"].includes(config.method) && Object.keys(params).length > 0) {
			queryParams = Object.fromEntries(
				Object.entries(params).filter(
					([key, value]) =>
						config.params[key] && config.params[key] === true
				)
			);
		}

		let finalParams = {
			...queryParams,
			...config.appendParams,
		};

		let dataFields;
		if (
			["POST", "PUT"].includes(config.method) &&
			Object.keys(data).length > 0
		) {
			dataFields = Object.fromEntries(
				Object.entries(data).filter(
					([key, value]) =>
						config.data[key] && config.data[key] === true
				)
			);
		}

		let finalData = {
			...dataFields,
			...config.appendData,
		};

		const requestConfig = {
			method: config.method,
			baseURL: config.baseURL,
			headers: config.headers || {},
			url: config.endpoint,
			data: ["POST", "PUT"].includes(config.method) ? finalData : {},
			params: ["GET"].includes(config.method) ? finalParams : {},
			...(config.optional || {}),
		};

		// Log request configuration
		logApiDetails("REQUEST_CONFIGURED", {
			requestConfig: {
				...requestConfig,
				headers: {
					...requestConfig.headers,
					Authorization: requestConfig.headers.Authorization
						? "[REDACTED]"
						: undefined,
				},
			},
		});

		const response = await axios(requestConfig);

		if (
			config.responseHandlers &&
			config.responseHandlers[response.status]
		) {
			return config.responseHandlers[response.status](response);
		}

		logApiDetails("RESPONSE_RECEIVED", {
			endpoint: config.endpoint,
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			dataSize: JSON.stringify(response.data).length,
			timestamp: new Date().toISOString(),
		});

		return response.data;
	} catch (error) {
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
			fullError: JSON.stringify(error, null, 2),
		});
		throw error;
	}
}

export async function makeDetailedApiCall(config, params = {}, data = {}) {
	// Log initial call details
	logApiDetails("API_CALL_INITIATED", {
		config,
		params,
		data,
	});

	try {
		// Log configuration
		logApiDetails("API_CONFIG_LOADED", {
			endpoint: config.endpoint,
			method: config.method,
			baseURL: config.baseURL,
		});

		let queryParams;
		if (["GET"].includes(config.method) && Object.keys(params).length > 0) {
			queryParams = Object.fromEntries(
				Object.entries(params).filter(
					([key, value]) =>
						config.params[key] && config.params[key] === true
				)
			);
		}

		let finalParams = {
			...queryParams,
			...config.appendParams,
		};

		const requestConfig = {
			method: config.method,
			baseURL: config.baseURL,
			headers: config.headers || {},
			url: config.endpoint,
			data: ["POST", "PUT"].includes(config.method) ? data : {},
			params: ["GET"].includes(config.method) ? finalParams : {},
			...(config.optional || {}),
		};

		// Log request initiation
		logApiDetails("REQUEST_INITIATED", {
			timestamp: new Date().toISOString(),
			url: `${requestConfig.baseURL}${requestConfig.url}`,
			method: requestConfig.method,
		});

		const response = await axios(requestConfig);

		// Log successful response
		logApiDetails("RESPONSE_RECEIVED", {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			dataSize: JSON.stringify(response.data).length,
			timestamp: new Date().toISOString(),
		});

		if (
			config.responseHandlers &&
			config.responseHandlers[response.status]
		) {
			const handledResponse =
				config.responseHandlers[response.status](response);
			logApiDetails("RESPONSE_HANDLED", {
				status: response.status,
				handlerApplied: true,
			});
			return handledResponse;
		}

		return response.data;
	} catch (error) {
		// Enhanced error logging
		const errorDetails = {
			timestamp: new Date().toISOString(),
			message: error.message,
			name: error.name,
			stack: error.stack,
			request: {
				url: error.config?.url,
				method: error.config?.method,
				headers: {
					...error.config?.headers,
					Authorization: error.config?.headers?.Authorization
						? "[REDACTED]"
						: undefined,
				},
				data: error.config?.data,
			},
			response: {
				status: error.response?.status,
				statusText: error.response?.statusText,
				headers: error.response?.headers,
				data: error.response?.data,
			},
			isAxiosError: error.isAxiosError,
			code: error.code,
		};

		logApiDetails("ERROR_OCCURRED", errorDetails);

		// Rethrow with additional context
		const enhancedError = new Error(error.message);
		enhancedError.originalError = error;
		enhancedError.details = errorDetails;
		throw enhancedError;
	}
}
