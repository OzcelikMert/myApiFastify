import { AuthSchema } from '@schemas/auth.schema';
import { AuthController } from '@controllers/auth.controller';
import { FastifyInstance } from 'fastify';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { AuthEndPoint } from '@constants/endPoints/auth.endPoint';

export const authRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new AuthEndPoint('');
  fastify.get(
    endPoint.GET,
    { preHandler: [SessionAuthMiddleware.check] },
    AuthController.getSession
  );
  fastify.post(
    endPoint.LOGIN,
    { preHandler: [RequestMiddleware.check(AuthSchema.post)] },
    AuthController.login
  );
  fastify.delete(
    endPoint.LOGOUT,
    { preHandler: [SessionAuthMiddleware.check] },
    AuthController.logOut
  );
  done();
};
