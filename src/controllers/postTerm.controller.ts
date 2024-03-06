import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    IPostTermDeleteManySchema,
    IPostTermGetWithIdSchema,
    IPostTermGetManySchema,
    IPostTermPostSchema,
    IPostTermPutWithIdSchema,
    IPostTermGetWithURLSchema, IPostTermPutRankWithIdSchema, IPostTermPutStatusManySchema
} from "../schemas/postTerm.schema";
import {PostTermService} from "../services/postTerm.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {IPostTermGetResultService} from "../types/services/postTerm.service";
import {IPostTermModel} from "../types/models/postTerm.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostTermGetResultService>();

        let reqData = req as IPostTermGetWithIdSchema;

        apiResult.data = await PostTermService.get({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostTermGetResultService[]>();

        let reqData = req as IPostTermGetManySchema;

        apiResult.data = await PostTermService.getMany({
            ...reqData.query,
            ...(req.isFromAdminPanel && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostTermGetResultService>();

        let reqData = req as IPostTermGetWithURLSchema;

        apiResult.data = await PostTermService.get({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostTermModel>();

        let reqData = req as IPostTermPostSchema;

        apiResult.data = await PostTermService.add({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            authorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostTermPutWithIdSchema;

        await PostTermService.update({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostTermPutRankWithIdSchema;

        await PostTermService.updateRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostTermPutStatusManySchema;

        await PostTermService.updateStatusMany({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostTermDeleteManySchema;

        await PostTermService.deleteMany({
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const PostTermController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithURL: getWithURL,
    add: add,
    updateWithId: updateWithId,
    updateRankWithId: updateRankWithId,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany
};