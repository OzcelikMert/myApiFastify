import {FastifyRequest, FastifyReply} from 'fastify';
import {Result} from "../library/api";
import {
    PostTermSchemaDeleteManyDocument,
    PostTermSchemaGetDocument,
    PostTermSchemaGetManyDocument,
    PostTermSchemaPostDocument,
    PostTermSchemaPutDocument,
    PostTermSchemaPutManyStatusDocument,
    PostTermSchemaPutRankDocument
} from "../schemas/postTerm.schema";
import postTermService from "../services/postTerm.service";
import logMiddleware from "../middlewares/log.middleware";
import permissionUtil from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaGetDocument;

        serviceResult.data = await postTermService.getOne({
            ...reqData.params,
            ...reqData.query,
            ...(req.isFromAdminPanel && !permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId) ? {authorId: req.sessionAuth.user!.userId.toString()} : {})
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaGetManyDocument;

        serviceResult.data = await postTermService.getMany({
            ...reqData.query,
            ...(req.isFromAdminPanel && !permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId) ? {authorId: req.sessionAuth.user!.userId.toString()} : {})
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaPostDocument;

        let insertData = await postTermService.add({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            authorId: req.sessionAuth!.user!.userId.toString(),
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaPutDocument;

        serviceResult.data = await postTermService.updateOne({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOneRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaPutRankDocument;

        serviceResult.data = await postTermService.updateOneRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaPutManyStatusDocument;

        serviceResult.data = await postTermService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostTermSchemaDeleteManyDocument;

        serviceResult.data = await postTermService.deleteMany({
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