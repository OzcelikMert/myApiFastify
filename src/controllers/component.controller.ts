import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    IComponentDeleteManySchema,
    IComponentGetWithIdSchema,
    IComponentGetManySchema,
    IComponentPostSchema, IComponentPutWithIdSchema
} from "../schemas/component.schema";
import {ComponentService} from "../services/component.service";
import {LogMiddleware} from "../middlewares/log.middleware";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentGetWithIdSchema;

        serviceResult.data = await ComponentService.getOne({
            ...reqData.params,
            ...reqData.query,
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentGetManySchema;

        serviceResult.data = await ComponentService.getMany({
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentPostSchema;

        let insertData = await ComponentService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString()
        });

        serviceResult.data = {_id: insertData._id};

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentPutWithIdSchema;

        serviceResult.data = await ComponentService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString()
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentDeleteManySchema;

        serviceResult.data = await ComponentService.deleteMany({
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const ComponentController = {
    getWithId: getWithId,
    getMany: getMany,
    add: add,
    updateWithId: updateWithId,
    deleteMany: deleteMany
};