import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { ViewService } from '@services/db/view.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IViewPostSchema } from '@schemas/view.schema';
import { VariableLibrary } from '@library/variable';
import { lookup } from 'geoip-lite';

const check = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IViewPostSchema;

    const url = VariableLibrary.isEmpty(reqData.body.url)
      ? '/'
      : reqData.body.url;
    const ip = req.ip;

    const dateStart = new Date(),
      dateEnd = new Date();
    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(0, 0, 0, 0);
    dateEnd.addDays(1);

    const serviceResult = await ViewService.get({
      ip: ip,
      url: url,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });

    if (serviceResult) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.registeredData;
      apiResult.setStatusCode = ApiStatusCodes.conflict;
    } else {
      const ipDetail = lookup(req.ip);
      await ViewService.add({
        ...reqData.body,
        ip: ip,
        url: url,
        ...ipDetail,
      });
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const ViewMiddleware = {
  check: check,
};
