import {FastifyRequest, FastifyReply} from 'fastify';
import {Result} from "../library/api";
import logMiddleware from "../middlewares/log.middleware";
import navigationService from "../services/navigation.service";
import {
    NavigationSchemaDeleteManyDocument,
    NavigationSchemaGetDocument,
    NavigationSchemaGetManyDocument,
    NavigationSchemaPostDocument,
    NavigationSchemaPutDocument,
    NavigationSchemaPutManyStatusDocument,
    NavigationSchemaPutRankDocument
} from "../schemas/navigation.schema";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaGetDocument;

        serviceResult.data = await navigationService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaGetManyDocument;

        serviceResult.data = await navigationService.getMany({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaPostDocument;

        let insertData = await navigationService.add({
            ...reqData.body,
            authorId: req.sessionAuth.user?._id.toString(),
            lastAuthorId: req.sessionAuth.user?._id.toString(),
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaPutDocument;

        serviceResult.data = await navigationService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth.user?._id.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOneRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaPutRankDocument;

        serviceResult.data = await navigationService.updateOneRank({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth.user?._id.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaPutManyStatusDocument;

        serviceResult.data = await navigationService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth.user?._id.toString()
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaDeleteManyDocument;

        serviceResult.data = await navigationService.deleteMany({
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
    updateOneRank: updateOneRank,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};