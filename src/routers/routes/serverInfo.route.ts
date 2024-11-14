import { FastifyInstance } from 'fastify';
import { ServerInfoController } from '@controllers/serverInfo.controller';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { PermissionMiddleware } from '@middlewares/validates/permission.middleware';
import { ServerInfoEndPoint } from '@constants/endPoints/serverInfo.endPoint';
import { ServerInfoEndPointPermission } from '@constants/endPointPermissions/serverInfo.endPoint.permission';

export const serverInfoRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new ServerInfoEndPoint('');
  fastify.get(
    endPoint.GET,
    {
      preHandler: [
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(ServerInfoEndPointPermission.GET),
      ],
    },
    ServerInfoController.get
  );
  done();
};
