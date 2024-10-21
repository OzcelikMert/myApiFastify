import * as Declaration from 'types/declaration';
import "@library/variable/array";
import "@library/variable/string";
import "@library/variable/number";
import "@library/variable/date";
import "@library/variable/math";
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifyCompress from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import chalk from 'chalk';
import config from "config";
import {routers} from "@routers/index";
import InitConfig from "@configs/index";
import {ViewInitMiddleware} from "@middlewares/init/view.init.middleware";
import {SessionAuthMiddleware} from "@middlewares/validates/sessionAuth.middleware";
import {RequestInitMiddleware} from "@middlewares/init/request.init.middleware";
import {Timers} from "@timers/index";

const port = config.get("serverPort") as number;
const trafficMBLimit = config.get("serverTrafficMBLimit") as number || 2;
const whitelist = config.get("whiteList") as string[];

console.time(`server`)
console.log(chalk.cyan(`\n=========  SERVER LOADING =========`));

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
        const responseTime = reply.elapsedTime;
        console.log(`Response time for ${chalk.green(request.method)} '${chalk.gray(request.url)}': ${chalk.yellow(responseTime.toFixed(2))}ms`);
    });

    server.addHook('preHandler', RequestInitMiddleware.set);
    server.addHook('preHandler', ViewInitMiddleware.set);
    server.addHook('preHandler', SessionAuthMiddleware.reload);

    await server.register(routers);

    Timers.initLongTimer();

    server.listen({port: port}, () => {
        console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
        console.timeEnd(`server`);
    });
})();


