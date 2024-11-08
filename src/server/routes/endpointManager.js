import express from 'express';
import { systemRoutes } from './systemRoutes.js';
import { userRoutes } from './userRoutes.js';
import { dataRoutes } from './dataRoutes.js';

export const routers = {
    systemRouter: {
        data: express.Router(),
        routes: systemRoutes
    },
    userRouter: {
        data: express.Router(),
        routes: userRoutes
    },
    dataRouter: {
        data: express.Router(),
        routes: dataRoutes
    }
}

function createEndpoint(router, config) {
    try {
        const {path, method, pipeline} = config;
        const handlers = pipeline.map((entry) => entry.handler);
        router[method.toLowerCase()](path, ...handlers);
    }
    catch (error) {
        console.error("Error creating endpoint: ", error)
    }
}

export function createEndpoints() {
    for (const [routername, {data, routes}] of Object.entries(routers)) {
        for (const config of Object.values(routes)) {

            createEndpoint(data, config)
        }
    }
}