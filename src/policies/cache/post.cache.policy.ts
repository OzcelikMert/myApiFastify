import { PostTypeId } from '@constants/postTypes';
import {
  IPostGetManySchema,
  IPostGetWithURLSchema,
} from '@schemas/post.schema';
import { FastifyRequest } from 'fastify';

const getMany = (req: FastifyRequest) => {
  const reqData = req as IPostGetManySchema;
  return !(
    req.isFromAdminPanel ||
    reqData.query._id ||
    reqData.query.categories ||
    reqData.query.authorId ||
    reqData.query.ignorePostId ||
    reqData.query.tags ||
    reqData.query.title ||
    reqData.query.typeId.length > 1
  );
};

const getWithURL = (req: FastifyRequest) => {
  const reqData = req as IPostGetWithURLSchema;
  return !(req.isFromAdminPanel || reqData.query.typeId != PostTypeId.Page);
};

export const PostCachePolicy = {
    getMany,
    getWithURL
};
