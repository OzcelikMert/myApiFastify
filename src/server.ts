import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifyCompress from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import InitConfig from "./config";
import chalk from 'chalk';
import routers from "./routers";
import config from "config";

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"
import viewInitMiddleware from "./middlewares/init/view.init.middleware";
import sessionAuthMiddleware from "./middlewares/validates/sessionAuth.middleware";

const port = config.get("serverPort") as number;
const trafficMBLimit = config.get("serverTrafficMBLimit") as number || 2;
const whitelist = config.get("whiteList") as string[];

console.time(`server`)
console.log(chalk.cyan?.(`\n=========  SERVER LOADING =========`));

const server = fastify({ trustProxy: true, logger: true, ignoreTrailingSlash: true });

new InitConfig(server as any).init().then(()=> {
    server.register(fastifyFormBody, {
        bodyLimit: trafficMBLimit,
    });

    server.register(fastifyCors, {
        origin: whitelist,
        methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    });

    server.register(fastifyCompress);
    server.register(fastifyMultipart);

    server.addHook('onResponse', async (request, reply) => {
        const responseTime = reply.getResponseTime();
        console.log(`Response time for ${request.method} ${request.url}: ${responseTime}ms`);
    });

    server.addHook('preHandler', viewInitMiddleware.set);
    server.addHook('preHandler', sessionAuthMiddleware.reload);

    server.register(routers);

    server.listen(port,() => {
        console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
        console.timeEnd(`server`);
    });
})


