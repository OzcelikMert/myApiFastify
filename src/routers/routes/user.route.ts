import { FastifyInstance } from 'fastify';
import { UserController } from '@controllers/user.controller';
import { UserSchema } from '@schemas/user.schema';
import { UserMiddleware } from '@middlewares/user.middleware';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { PermissionMiddleware } from '@middlewares/validates/permission.middleware';
import { UserEndPointPermission } from '@constants/endPointPermissions/user.endPoint.permission';
import { UserEndPoint } from '@constants/endPoints/user.endPoint';

export const userRoute = function (
  fastify: FastifyInstance,
  opts: {},
  done: () => void
) {
  const endPoint = new UserEndPoint('');
  fastify.get(
    endPoint.GET,
    { preHandler: [RequestMiddleware.check(UserSchema.getMany)] },
    UserController.getMany
  );
  fastify.get(
    endPoint.GET_WITH_URL,
    { preHandler: [RequestMiddleware.check(UserSchema.getWithURL)] },
    UserController.getWithURL
  );
  fastify.get(
    endPoint.GET_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.getWithId),
        SessionAuthMiddleware.check,
      ],
    },
    UserController.getWithId
  );
  fastify.post(
    endPoint.ADD,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.post),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(UserEndPointPermission.ADD),
        UserMiddleware.checkRoleRank,
        UserMiddleware.checkAlreadyEmail,
      ],
    },
    UserController.add
  );
  fastify.put(
    endPoint.UPDATE_PROFILE,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.putProfile),
        SessionAuthMiddleware.check,
      ],
    },
    UserController.updateProfile
  );
  fastify.put(
    endPoint.UPDATE_PROFILE_IMAGE,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.putProfileImage),
        SessionAuthMiddleware.check,
      ],
    },
    UserController.updateProfileImage
  );
  fastify.put(
    endPoint.UPDATE_PASSWORD,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.putPassword),
        SessionAuthMiddleware.check,
        UserMiddleware.checkPasswordWithSessionEmail,
      ],
    },
    UserController.updatePassword
  );
  fastify.put(
    endPoint.UPDATE_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.putWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(UserEndPointPermission.UPDATE),
        UserMiddleware.checkWithId,
        UserMiddleware.checkRoleRank,
        UserMiddleware.checkAlreadyEmail,
      ],
    },
    UserController.updateWithId
  );
  fastify.delete(
    endPoint.DELETE_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(UserSchema.deleteWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(UserEndPointPermission.DELETE),
        UserMiddleware.checkWithId,
        UserMiddleware.checkRoleRank,
      ],
    },
    UserController.deleteWithId
  );
  done();
};
