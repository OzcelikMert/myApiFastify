import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {SubscriberService} from "@services/subscriber.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {
    ISubscriberDeleteWithIdSchema, ISubscriberDeleteManySchema,
    ISubscriberGetWithIdSchema,
    ISubscriberGetManySchema,
    ISubscriberPostSchema, ISubscriberDeleteWithEmailSchema, ISubscriberGetWithEmailSchema
} from "@schemas/subscriber.schema";
import {ISubscriberModel} from "types/models/subscriber.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISubscriberModel>();

        const reqData = req as ISubscriberGetWithIdSchema;

        apiResult.data = await SubscriberService.get({
            ...reqData.params
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISubscriberModel[]>();

        const reqData = req as ISubscriberGetManySchema;

        apiResult.data = await SubscriberService.getMany({
            ...reqData.query
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISubscriberModel>();

        const reqData = req as ISubscriberGetWithEmailSchema;

        apiResult.data = await SubscriberService.get({
            ...reqData.params
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISubscriberModel>();

        const reqData = req as ISubscriberPostSchema;

        apiResult.data = await SubscriberService.add({
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as ISubscriberDeleteWithIdSchema;

        await SubscriberService.delete({
            ...reqData.params
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as ISubscriberDeleteWithEmailSchema;

        await SubscriberService.delete({
            ...reqData.params
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as ISubscriberDeleteManySchema;

        await SubscriberService.deleteMany({
            ...reqData.body
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const SubscriberController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithEmail: getWithEmail,
    add: add,
    deleteWithId: deleteWithId,
    deleteWithEmail: deleteWithEmail,
    deleteMany: deleteMany
};