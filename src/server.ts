import config from 'config';
const runType = config.get('runType') as string;
if(runType == "production"){
  require('module-alias/register');
}
import * as Declaration from 'types/declaration';
import '@library/variable/array';
import '@library/variable/string';
import '@library/variable/number';
import '@library/variable/date';
import '@library/variable/math';
import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifyCompress from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import chalk from 'chalk';
import { routers } from '@routers/index';
import InitConfig from '@configs/index';
import { ViewInitMiddleware } from '@middlewares/init/view.init.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { RequestInitMiddleware } from '@middlewares/init/request.init.middleware';

const port = config.get('serverPort') as number;
const trafficMBLimit = (config.get('serverTrafficMBLimit') as number) || 2;
const whitelist = config.get('whiteList') as string[];
const SSLKey = config.get('SSLKey') as string;
const SSLCert = config.get('SSLCert') as string;

console.time(`app`);
console.log(chalk.cyan(`\n=========  SERVER LOADING (${chalk.blue(runType)}) =========`));

export default async function plugin (app: FastifyInstance, options: {}) {
  await new InitConfig(app).init();

  await app.register(fastifyFormBody, {
    bodyLimit: trafficMBLimit,
  });

  await app.register(fastifyCors, {
    origin: whitelist,
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
  });

  await app.register(fastifyCompress);
  await app.register(fastifyMultipart);

  await app.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.elapsedTime;
    console.log(
      `Response time for ${chalk.green(request.method)} '${chalk.gray(request.url)}': ${chalk.yellow(responseTime.toFixed(2))}ms`
    );
  });

  await app.addHook('preHandler', RequestInitMiddleware.set);
  await app.addHook('preHandler', ViewInitMiddleware.set);
  await app.addHook('preHandler', SessionAuthMiddleware.reload);

  await app.register(routers);

  console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
  console.timeEnd(`app`);
}

export const options = {
  pluginTimeout: 10000,
  trustProxy: true,
  logger: true,
  ignoreTrailingSlash: true,
  ...(SSLKey && SSLCert ? { 
    https: {
      key: SSLKey,
      cert: SSLCert
    }
  } : {})
}

if(runType === "dev"){
  const app = fastify(options);
  plugin(app, options);
}