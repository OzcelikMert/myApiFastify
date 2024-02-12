import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {SubscriberService} from "../services/subscriber.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {
    SubscriberSchemaDeleteOneDocument, SubscriberSchemaDeleteManyDocument,
    SubscriberSchemaGetOneDocument,
    SubscriberSchemaGetManyDocument,
    SubscriberSchemaPostDocument, SubscriberSchemaDeleteOneWithEmailDocument, SubscriberSchemaGetOneWithEmailDocument
} from "../schemas/subscriber.schema";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaGetOneDocument;

        serviceResult.data = await SubscriberService.getOne({
            ...reqData.params
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaGetManyDocument;

        serviceResult.data = await SubscriberService.getMany({
            ...reqData.query
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getOneWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaGetOneWithEmailDocument;

        serviceResult.data = await SubscriberService.getOne({
            ...reqData.params
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaPostDocument;

        let insertData = await SubscriberService.add({
            ...reqData.body
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaDeleteOneDocument;

        serviceResult.data = await SubscriberService.deleteOne({
            ...reqData.params
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteOneWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaDeleteOneWithEmailDocument;

        serviceResult.data = await SubscriberService.deleteOne({
            ...reqData.params
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaDeleteManyDocument;

        serviceResult.data = await SubscriberService.deleteMany({
            ...reqData.body
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const SubscriberController = {
    getOne: getOne,
    getMany: getMany,
    getOneWithEmail: getOneWithEmail,
    add: add,
    deleteOne: deleteOne,
    deleteOneWithEmail: deleteOneWithEmail,
    deleteMany: deleteMany
};