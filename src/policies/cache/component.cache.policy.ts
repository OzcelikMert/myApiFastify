import { ComponentTypeId } from '@constants/componentTypes';
import { IComponentGetManySchema } from '@schemas/component.schema';
import { FastifyRequest } from 'fastify';

const getMany = (req: FastifyRequest) => {
  const reqData = req as IComponentGetManySchema;
  return !(
    req.isFromAdminPanel ||
    !reqData.query.typeId ||
    reqData.query.key ||
    (reqData.query.typeId == ComponentTypeId.Private && !reqData.query._id) ||
    (reqData.query.typeId == ComponentTypeId.Public && reqData.query._id)
  );
};

export const ComponentCachePolicy = {
    getMany
};
