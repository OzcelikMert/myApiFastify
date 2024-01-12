import {FastifyRequest, FastifyReply} from 'fastify';
import {Result} from "../library/api";
import postService from "../services/post.service";
import logMiddleware from "../middlewares/log.middleware";
import {
    PostSchemaDeleteManyDocument,
    PostSchemaGetCountDocument,
    PostSchemaGetDocument,
    PostSchemaGetManyDocument,
    PostSchemaPostDocument,
    PostSchemaPutDocument,
    PostSchemaPutManyStatusDocument,
    PostSchemaPutRankDocument,
    PostSchemaPutViewDocument
} from "../schemas/post.schema";

const createUrl = async (_id: string | null | undefined, name: string, typeId: number) => {
    let urlAlreadyCount = 2;
    let url = name.convertSEOUrl();

    let oldUrl = url;
    while ((await postService.getOne({
        ignorePostId: _id ? [_id] : undefined,
        url: url,
        typeId: typeId
    }))) {
        url = `${oldUrl}-${urlAlreadyCount}`;
        urlAlreadyCount++;
    }

    return url;
}

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaGetDocument;

        serviceResult.data = await postService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaGetManyDocument;

        serviceResult.data = await postService.getMany({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaGetCountDocument;

        serviceResult.data = await postService.getCount({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPostDocument;
        let url = await createUrl(null, reqData.body.contents.title, reqData.body.typeId);
        reqData.body.contents.url = url;

        let insertData = await postService.add({
            ...reqData.body,
            authorId: req.sessionAuth.user!.userId.toString(),
            lastAuthorId: req.sessionAuth.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPutDocument;
        let url = await createUrl(reqData.params._id, reqData.body.contents.title, reqData.body.typeId);
        reqData.body.contents.url = url;

        serviceResult.data = await postService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOneRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPutRankDocument;

        serviceResult.data = await postService.updateOneRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOneView = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPutViewDocument;

        serviceResult.data = await postService.updateOneView({
            ...reqData.params,
            ...reqData.body
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPutManyStatusDocument;

        serviceResult.data = await postService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaDeleteManyDocument;

        serviceResult.data = await postService.deleteMany({
            ...reqData.body
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getOne: getOne,
    getMany: getMany,
    getCount: getCount,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank,
    updateOneView: updateOneView,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};