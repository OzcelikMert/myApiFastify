import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { LogMiddleware } from '@middlewares/log.middleware';
import { LanguageService } from '@services/language.service';
import { ILanguagePutWithIdSchema } from '@schemas/language.schema';
import { ILanguageModel } from 'types/models/language.model';
import { StatusId } from '@constants/status';

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ILanguagePutWithIdSchema;

    const serviceResult = await LanguageService.get({
      _id: reqData.params._id,
    });

    if (!serviceResult) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    } else {
      req.cachedServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkIsDefaultWithId = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ILanguagePutWithIdSchema;

    const serviceResult = req.cachedServiceResult as ILanguageModel;

    if (!serviceResult.isDefault && reqData.body.isDefault) {
      await LanguageService.updateIsDefaultMany({ isDefault: false });
    } else if (serviceResult.isDefault && (!reqData.body.isDefault || reqData.body.statusId != StatusId.Active)) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.emptyValue;
      apiResult.setStatusCode = ApiStatusCodes.badRequest;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const LanguageMiddleware = {
  checkWithId: checkWithId,
  checkIsDefaultWithId: checkIsDefaultWithId,
};
