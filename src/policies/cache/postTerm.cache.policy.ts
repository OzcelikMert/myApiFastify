import { IPostTermGetManySchema } from '@schemas/postTerm.schema';
import { FastifyRequest } from 'fastify';

const getMany = (req: FastifyRequest) => {
  const reqData = req as IPostTermGetManySchema;
  return !(
    req.isFromAdminPanel ||
    reqData.query._id ||
    reqData.query.title ||
    reqData.query.withPostCount ||
    !reqData.query.typeId ||
    reqData.query.typeId.length > 1
  );
};

export const PostTermCachePolicy = {
    getMany
};
