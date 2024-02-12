import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifyCompress from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import InitConfig from "./config";
import chalk from 'chalk';
import {routers} from "./routers";
import config from "config";

import * as Declaration from './types/declaration'
import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"
import {ViewInitMiddleware} from "./middlewares/init/view.init.middleware";
import {SessionAuthMiddleware} from "./middlewares/validates/sessionAuth.middleware";
import {RequestInitMiddleware} from "./middlewares/init/request.init.middleware";

const port = config.get("serverPort") as number;
const trafficMBLimit = config.get("serverTrafficMBLimit") as number || 2;
const whitelist = config.get("whiteList") as string[];

console.time(`server`)
console.log(chalk.cyan?.(`\n=========  SERVER LOADING =========`));

(async () => {
    const server = await fastify({ trustProxy: true, logger: true, ignoreTrailingSlash: true });

    await new InitConfig(server).init();

    await server.register(fastifyFormBody, {
        bodyLimit: trafficMBLimit,
    });

    await server.register(fastifyCors, {
        origin: whitelist,
        methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    });

    await server.register(fastifyCompress);
    await server.register(fastifyMultipart);

    server.addHook('onResponse', async (request, reply) => {
        const responseTime = reply.getResponseTime();
        console.log(`Response time for ${request.method} ${request.url}: ${responseTime}ms`);
    });

    server.addHook('preHandler', RequestInitMiddleware.set);
    server.addHook('preHandler', ViewInitMiddleware.set);
    server.addHook('preHandler', SessionAuthMiddleware.reload);

    await server.register(routers);

    server.listen({port: port}, () => {
        console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
        console.timeEnd(`server`);
    });
})();


