import { FastifyInstance } from 'fastify';
import { ViewController } from '@controllers/view.controller';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { ViewEndPoint } from '@constants/endPoints/view.endPoint';

export const viewRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new ViewEndPoint('');
  fastify.get(
    endPoint.GET_NUMBER,
    { preHandler: [SessionAuthMiddleware.check] },
    ViewController.getNumber
  );
  fastify.get(
    endPoint.GET_STATISTICS,
    { preHandler: [SessionAuthMiddleware.check] },
    ViewController.getStatistics
  );
  done();
};
