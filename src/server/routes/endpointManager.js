import express from "express";
import { systemRoutes } from "./systemRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { dataRoutes } from "./dataRoutes.js";
import { chatRoutes } from "./chatRoutes.js";

export const routers = {
	systemRouter: {
		routerObject: express.Router(),
		routes: systemRoutes,
	},
	userRouter: {
		routerObject: express.Router(),
		routes: userRoutes,
	},
	dataRouter: {
		routerObject: express.Router(),
		routes: dataRoutes,
	},
	chatRouter: {
		routerObject: express.Router(),
		routes: chatRoutes,
	},
};

function createEndpoint(routerObject, config) {
	try {
		const { path, method, pipeline } = config;
		const handlers = pipeline.map((entry) => entry.handler);
		routerObject[method.toLowerCase()](path, ...handlers);
	} catch (error) {
		console.error("Error creating endpoint: ", error);
	}
}

export function createEndpoints() {
	for (const [_, { routerObject, routes }] of Object.entries(routers)) {
		for (const config of Object.values(routes)) {
			createEndpoint(routerObject, config);
		}
	}
}
