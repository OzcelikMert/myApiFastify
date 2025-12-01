import { FastifyRequest, FastifyReply } from 'fastify';
import { LogMiddleware } from '@middlewares/log.middleware';
import { UserService } from '@services/user.service';
import { StatusId } from '@constants/status';

const set = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const requestURL = req.headers.origin || '';

    req.isAuthenticated = false;
    req.isFromAdminPanel =
      requestURL.includes('admin.') || requestURL.includes('localhost:3001');

    if (req.isFromAdminPanel) {
      if (req.sessionAuth && req.sessionAuth.user) {
        const serviceResult = await UserService.get({
          _id: req.sessionAuth.user.userId.toString(),
          statusId: StatusId.Active,
        });
        if (serviceResult) {
          req.isAuthenticated = true;
        }
      }
    }
  });
};

export const RequestInitMiddleware = {
  set: set,
};
