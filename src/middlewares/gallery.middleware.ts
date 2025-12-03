import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { LogMiddleware } from '@middlewares/log.middleware';
import { UserRoleId } from '@constants/userRoles';
import { GalleryService } from '@services/db/gallery.service';
import { IGalleryDeleteManySchema } from '@schemas/gallery.schema';
import { PermissionUtil } from '@utils/permission.util';
import { IGalleryModel } from 'types/models/gallery.model';

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IGalleryDeleteManySchema;

    const serviceResult = await GalleryService.getMany({
      _id: reqData.body._id,
    });

    if (
      serviceResult.length == 0 ||
      serviceResult.length != reqData.body._id.length
    ) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    } else {
      req.cachedAnyServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkIsAuthorMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IGalleryDeleteManySchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.Editor
      )
    ) {
      const serviceResult = req.cachedAnyServiceResult as IGalleryModel[];

      if (serviceResult) {
        for (const item of serviceResult) {
          if (
            item.authorId.toString() != req.sessionAuth!.user?.userId.toString()
          ) {
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.noPerm;
            apiResult.setStatusCode = ApiStatusCodes.forbidden;
            break;
          }
        }
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const GalleryMiddleware = {
  checkMany: checkMany,
  checkIsAuthorMany: checkIsAuthorMany,
};
