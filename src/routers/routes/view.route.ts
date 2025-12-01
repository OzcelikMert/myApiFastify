import { FastifyInstance } from 'fastify';
import { ViewController } from '@controllers/view.controller';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { ViewEndPoint } from '@constants/endPoints/view.endPoint';

export const viewRoute = function (
  fastify: FastifyInstance,
  opts: {},
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
  fastify.get(
    endPoint.WEBSOCKET_VISITOR_COUNT,
    { websocket: true },
    ViewController.webSocketLiveVisitorCount
  );
  fastify.get(
    endPoint.WEBSOCKET_ONLINE_USERS,
    { websocket: true, preHandler: [SessionAuthMiddleware.check] },
    ViewController.webSocketOnlineUsers
  );
  done();
};
