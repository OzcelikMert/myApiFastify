import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { LogMiddleware } from '@middlewares/log.middleware';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import {
  ISettingPutContactFormSchema,
  ISettingPutGeneralSchema,
  ISettingPutSocialMediaSchema,
} from '@schemas/setting.schema';
import { SettingService } from '@services/setting.service';
import { SettingProjectionKeys } from '@constants/settingProjections';

const check = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkPermissionForGeneral = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutGeneralSchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.SuperAdmin
      )
    ) {
      const serviceResult = await SettingService.get({
        projection: SettingProjectionKeys.General,
      });

      if (serviceResult) {
        const reqToCheck = {
          head: reqData.body.head ?? '',
          script: reqData.body.script ?? '',
        };

        const serviceToCheck = {
          head: serviceResult.head ?? '',
          script: serviceResult.script ?? '',
        };

        if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
          apiResult.status = false;
          apiResult.setErrorCode = ApiErrorCodes.noPerm;
          apiResult.setStatusCode = ApiStatusCodes.forbidden;
        }
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkPermissionForSocialMedia = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutSocialMediaSchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.SuperAdmin
      )
    ) {
      const serviceResult = await SettingService.get({
        projection: SettingProjectionKeys.SocialMedia,
      });

      if (serviceResult) {
        const reqToCheck = reqData.body.socialMedia.map((item) => ({
          _id: item._id,
          key: item.key,
          title: item.title,
        }));

        const serviceToCheck = serviceResult.socialMedia.map((item) => ({
          _id: item._id,
          key: item.key,
          title: item.title,
        }));

        if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
          apiResult.status = false;
          apiResult.setErrorCode = ApiErrorCodes.noPerm;
          apiResult.setStatusCode = ApiStatusCodes.forbidden;
        }
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkPermissionForContactForms = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutContactFormSchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.SuperAdmin
      )
    ) {
      const serviceResult = await SettingService.get({
        projection: SettingProjectionKeys.ContactForm,
      });

      if (serviceResult) {
        const reqToCheck = reqData.body.contactForms.map((item) => ({
          _id: item._id,
          key: item.key,
        }));

        const serviceToCheck = serviceResult.contactForms.map((item) => ({
          _id: item._id,
          key: item.key,
        }));

        if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
          apiResult.status = false;
          apiResult.setErrorCode = ApiErrorCodes.noPerm;
          apiResult.setStatusCode = ApiStatusCodes.forbidden;
        }
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const SettingMiddleware = {
  check: check,
  checkPermissionForSocialMedia: checkPermissionForSocialMedia,
  checkPermissionForContactForms: checkPermissionForContactForms,
  checkPermissionForGeneral: checkPermissionForGeneral,
};
