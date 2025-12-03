import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import {
  ISettingGetSchema,
  ISettingPutContactFormSchema,
  ISettingPutECommerceSchema,
  ISettingPutGeneralSchema,
  ISettingPutPathSchema,
  ISettingPutSEOSchema,
  ISettingPutSocialMediaSchema,
} from '@schemas/setting.schema';
import { SettingService } from '@services/db/setting.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import { ISettingGetResultService } from 'types/services/db/setting.service';

const get = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ISettingGetResultService>();

    const reqData = req as ISettingGetSchema;

    apiResult.data = await SettingService.get(
      {
        ...reqData.query,
      },
      false
    );

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateGeneral = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutGeneralSchema;

    await SettingService.updateGeneral(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateSEO = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutSEOSchema;

    await SettingService.updateSEO(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutContactFormSchema;

    await SettingService.updateContactForm(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateSocialMedia = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutSocialMediaSchema;

    await SettingService.updateSocialMedia(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateECommerce = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutECommerceSchema;

    await SettingService.updateECommerce(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updatePath = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISettingPutPathSchema;

    await SettingService.updatePath(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const SettingController = {
  get: get,
  updateGeneral: updateGeneral,
  updateSEO: updateSEO,
  updateContactForm: updateContactForm,
  updateSocialMedia: updateSocialMedia,
  updateECommerce: updateECommerce,
  updatePath: updatePath,
};
