import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    IPostTermDeleteManySchema,
    IPostTermGetWithIdSchema,
    IPostTermGetManySchema,
    IPostTermPostSchema,
    IPostTermPutWithIdSchema,
    IPostTermPutManyStatusSchema,
    IPostTermPutWithIdRankSchema, IPostTermGetWithURLSchema
} from "../schemas/postTerm.schema";
import {PostTermService} from "../services/postTerm.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {IPostTermGetResultService} from "../types/services/postTerm.service";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IPostTermGetResultService>();

        let reqData = req as IPostTermGetWithIdSchema;

        serviceResult.data = await PostTermService.getOne({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IPostTermGetResultService[]>();

        let reqData = req as IPostTermGetManySchema;

        serviceResult.data = await PostTermService.getMany({
            ...reqData.query,
            ...(req.isFromAdminPanel && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IPostTermGetResultService>();

        let reqData = req as IPostTermGetWithURLSchema;

        serviceResult.data = await PostTermService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostTermPostSchema;

        await PostTermService.add({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            authorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostTermPutWithIdSchema;

        await PostTermService.updateOne({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithIdRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostTermPutWithIdRankSchema;

        await PostTermService.updateOneRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostTermPutManyStatusSchema;

        await PostTermService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostTermDeleteManySchema;

        await PostTermService.deleteMany({
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const PostTermController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithURL: getWithURL,
    add: add,
    updateWithId: updateWithId,
    updateWithIdRank: updateWithIdRank,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};