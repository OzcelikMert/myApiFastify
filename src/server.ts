import * as Declaration from 'types/declaration';
import '@library/variable/array';
import '@library/variable/string';
import '@library/variable/number';
import '@library/variable/date';
import '@library/variable/math';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifyCompress from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import chalk from 'chalk';
import config from 'config';
import { routers } from '@routers/index';
import InitConfig from '@configs/index';
import { ViewInitMiddleware } from '@middlewares/init/view.init.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { RequestInitMiddleware } from '@middlewares/init/request.init.middleware';

const port = config.get('serverPort') as number;
const runType = config.get('runType') as string;
const trafficMBLimit = (config.get('serverTrafficMBLimit') as number) || 2;
const whitelist = config.get('whiteList') as string[];

console.time(`app`);
console.log(chalk.cyan(`\n=========  SERVER LOADING =========`));

export const app = fastify({
  trustProxy: true,
  logger: true,
  ignoreTrailingSlash: true,
});

(async () => {
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

  app.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.elapsedTime;
    console.log(
      `Response time for ${chalk.green(request.method)} '${chalk.gray(request.url)}': ${chalk.yellow(responseTime.toFixed(2))}ms`
    );
  });

  app.addHook('preHandler', RequestInitMiddleware.set);
  app.addHook('preHandler', ViewInitMiddleware.set);
  app.addHook('preHandler', SessionAuthMiddleware.reload);

  await app.register(routers);

  if (runType !== 'test') {
    app.listen({ port: port }, () => {
      console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
      console.timeEnd(`app`);
    });
  }
})();
