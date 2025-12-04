import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ViewService } from '@services/db/view.service';
import { Config } from '@configs/index';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IViewGetTotalResultService } from 'types/services/db/view.service';
import { WebSocket } from '@fastify/websocket';

const sendVisitorCount = (connection?: WebSocket) => {
  const apiResult = new ApiResult<number>();
  apiResult.data = Config.visitorCount;
  if (connection) {
    connection.send(JSON.stringify(apiResult));
  } else {
    for (const onlineUser of Config.onlineUsers) {
      onlineUser.connection.send(JSON.stringify(apiResult));
    }
  }
};

const getNumber = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<{
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

const webSocketLiveVisitorCount = async (
  connection: WebSocket,
  req: FastifyRequest
) => {
  Config.visitorCount += 1;
  sendVisitorCount();

  connection.on('close', () => {
    Config.visitorCount = Config.visitorCount > 0 ? Config.visitorCount - 1 : 0;
    sendVisitorCount();
  });
};

const webSocketOnlineUsers = async (
  connection: WebSocket,
  req: FastifyRequest
) => {
  const ip = req.ip;
  const date = new Date();

  Config.onlineUsers.push({
    ip,
    _id: req.sessionAuth!.user!.userId,
    createdAt: date,
    connection,
  });

  sendVisitorCount(connection);

  connection.on('close', () => {
    Config.onlineUsers = Config.onlineUsers.filter(
      (item) => item.connection !== connection
    );
  });
};

export const ViewController = {
  getNumber: getNumber,
  getStatistics: getStatistics,
  webSocketLiveVisitorCount,
  webSocketOnlineUsers,
};
