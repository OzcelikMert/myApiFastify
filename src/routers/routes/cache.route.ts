import { FastifyInstance } from 'fastify';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { CacheEndPoint } from '@constants/endPoints/cache.endPoint';
import { PermissionMiddleware } from '@middlewares/validates/permission.middleware';
import { CacheEndPointPermission } from '@constants/endPointPermissions/cache.endPoint.permission';
import { CacheController } from '@controllers/cache.controller';

export const cacheRoute = function (
  fastify: FastifyInstance,
  opts: {},
  done: () => void
) {
  const endPoint = new CacheEndPoint('');
  fastify.delete(
    endPoint.DELETE_ALL,
    { preHandler: [SessionAuthMiddleware.check, PermissionMiddleware.check(CacheEndPointPermission.DELETE)] },
    CacheController.deleteAll
  );
  done();
};
