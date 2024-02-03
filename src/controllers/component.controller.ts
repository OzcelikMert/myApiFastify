import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import {
    ComponentSchemaDeleteManyDocument,
    ComponentSchemaGetOneDocument,
    ComponentSchemaGetManyDocument,
    ComponentSchemaPostDocument, ComponentSchemaPutOneDocument
} from "../schemas/component.schema";
import componentService from "../services/component.service";
import logMiddleware from "../middlewares/log.middleware";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as ComponentSchemaGetOneDocument;

        serviceResult.data = await componentService.getOne({
            ...reqData.params,
            ...reqData.query,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as ComponentSchemaGetManyDocument;

        serviceResult.data = await componentService.getMany({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as ComponentSchemaPostDocument;

        let insertData = await componentService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString()
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as ComponentSchemaPutOneDocument;

        serviceResult.data = await componentService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString()
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as ComponentSchemaDeleteManyDocument;

        serviceResult.data = await componentService.deleteMany({
            ...reqData.body
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getOne: getOne,
    getMany: getMany,
    add: add,
    updateOne: updateOne,
    deleteMany: deleteMany
};