import { FastifyRequest, FastifyReply } from 'fastify';
import { Config } from '@configs/index';
import { LogMiddleware } from '@middlewares/log.middleware';

const set = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const ip = req.ip;
    const date = new Date();

    /*if (!req.isFromAdminPanel) {
      // Clear offline viewers
      Config.viewers = Config.viewers.filter(
        (item) => date.diffMinutes(item.updatedAt) < 10
      );

      // Update or add new viewer
      const findIndex = Config.viewers.indexOfKey('ip', ip);
      if (findIndex > -1) {
        Config.viewers[findIndex].updatedAt = date;
      } else {
        Config.viewers.push({
          ip: ip,
          createdAt: date,
          updatedAt: date,
        });
      }
    } else {
      if (req.sessionAuth && req.sessionAuth.user) {
        // Clear offline online users
        Config.onlineUsers = Config.onlineUsers.filter(
          (item) => date.diffMinutes(item.updatedAt) < 10
        );

        // Update or add new online user
        const findIndex = Config.onlineUsers.indexOfKey('ip', ip);
        if (findIndex > -1) {
          Config.onlineUsers[findIndex].updatedAt = date;
        } else {
          Config.onlineUsers.push({
            ip: ip,
            _id: req.sessionAuth.user.userId,
            createdAt: date,
            updatedAt: date,
          });
        }
      }
    }*/
  });
};

export const ViewInitMiddleware = {
  set: set,
};
