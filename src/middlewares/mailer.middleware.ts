import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { SettingService } from '@services/setting.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IMailerPostSchema } from '@schemas/mailer.schema';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';

const checkContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IMailerPostSchema;

    if (
      VariableLibrary.isEmpty(reqData.body._id) &&
      VariableLibrary.isEmpty(reqData.body.key)
    ) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.emptyValue;
      apiResult.setStatusCode = ApiStatusCodes.conflict;
    } else {
      const setting = await SettingService.get(
        { projection: SettingProjectionKeys.ContactForm },
        true
      );
      if (setting) {
        const key = reqData.body._id ? '_id' : 'key';
        const value = reqData.body._id
          ? MongoDBHelpers.convertToObjectId(reqData.body._id)
          : reqData.body.key;
        const contactForm = setting.contactForms?.findSingle(key, value);
        if (contactForm) {
          req.cachedServiceResult = contactForm;
        } else {
          apiResult.status = false;
          apiResult.setErrorCode = ApiErrorCodes.notFound;
          apiResult.setStatusCode = ApiStatusCodes.notFound;
        }
      } else {
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.notFound;
        apiResult.setStatusCode = ApiStatusCodes.conflict;
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const MailerMiddleware = {
  checkContactForm: checkContactForm,
};
