import { INavigationGetManySchema } from '@schemas/navigation.schema';
import { FastifyRequest } from 'fastify';

const getMany = (req: FastifyRequest) => {
  const reqData = req as INavigationGetManySchema;
  return !(
    req.isFromAdminPanel ||
    reqData.query._id
  );
};

export const NavigationCachePolicy = {
    getMany
};
