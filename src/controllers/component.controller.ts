import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IComponentGetDetailedResultService} from "types/services/component.service";
import {
    IComponentDeleteManySchema,
    IComponentGetManySchema,
    IComponentGetWithKeySchema,
    IComponentGetWithIdSchema, IComponentPostSchema, IComponentPutWithIdSchema
} from "@schemas/component.schema";
import {ComponentService} from "@services/component.service";
import {IComponentModel} from "types/models/component.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IComponentGetDetailedResultService>();

        let reqData = req as IComponentGetWithIdSchema;

        apiResult.data = await ComponentService.getDetailed({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.getStatusCode).send(apiResult)
    })
}

const getWithKey = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IComponentGetDetailedResultService>();

        let reqData = req as IComponentGetWithKeySchema;

        apiResult.data = await ComponentService.getDetailed({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.getStatusCode).send(apiResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IComponentGetDetailedResultService[]>();

        let reqData = req as IComponentGetManySchema;

        apiResult.data = await ComponentService.getManyDetailed({
            ...reqData.query
        });

        await reply.status(apiResult.getStatusCode).send(apiResult)
    })
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IComponentModel>();

        let reqData = req as IComponentPostSchema;

        apiResult.data = await ComponentService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IComponentPutWithIdSchema;

        await ComponentService.update({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IComponentDeleteManySchema;

        await ComponentService.deleteMany({
            ...reqData.body
        });

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

export const ComponentController = {
    getWithId: getWithId,
    getWithKey: getWithKey,
    getMany: getMany,
    add: add,
    updateWithId: updateWithId,
    deleteMany: deleteMany
};