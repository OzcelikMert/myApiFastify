import { FastifyRequest, FastifyReply } from 'fastify';
import { Config } from '@configs/index';
import { LogMiddleware } from '@middlewares/log.middleware';

const set = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    if (!req.isFromAdminPanel) {
      const ip = req.ip;
      const date = new Date();
      const _id =
        req.sessionAuth && req.sessionAuth.user
          ? req.sessionAuth.user.userId.toString()
          : '';

      Config.onlineUsers = Config.onlineUsers.filter(
        (onlineUser) => date.diffMinutes(onlineUser.updatedAt) < 10
      );

      const findIndex = Config.onlineUsers.indexOfKey('ip', ip);
      if (findIndex > -1) {
        Config.onlineUsers[findIndex].updatedAt = date;
        Config.onlineUsers[findIndex]._id = _id;
      } else {
        Config.onlineUsers.push({
          ip: ip,
          createdAt: date,
          updatedAt: date,
          _id: _id,
        });
      }
    }
  });
};

export const ViewInitMiddleware = {
  set: set,
};
