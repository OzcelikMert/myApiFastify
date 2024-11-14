import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ViewService } from '@services/view.service';
import { Config } from '@configs/index';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IViewGetTotalResultService } from 'types/services/view.service';

const getNumber = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<{
      liveTotal: number;
      averageTotal: number;
      weeklyTotal: number;
    }>();

    const dateStart = new Date();
    dateStart.addDays(-7);

    const serviceResult = await ViewService.getTotalWithDate({
      dateStart: dateStart,
    });

    let total = 0;

    for (const data of serviceResult) {
      total += data.total;
    }

    const averageTotal = Math.ceil(total / 7);
    const weeklyTotal = total;

    apiResult.data = {
      liveTotal: Config.onlineUsers.length,
      averageTotal: averageTotal,
      weeklyTotal: weeklyTotal,
    };

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getStatistics = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<{
      day: IViewGetTotalResultService[];
      country: IViewGetTotalResultService[];
    }>();

    const dateStart = new Date();
    dateStart.addDays(-7);

    apiResult.data = {
      day: await ViewService.getTotalWithDate({ dateStart: dateStart }),
      country: await ViewService.getTotalWithCountry({ dateStart: dateStart }),
    };

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const ViewController = {
  getNumber: getNumber,
  getStatistics: getStatistics,
};
