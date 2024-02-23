import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {PostService} from "../services/post.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {
    IPostDeleteManySchema,
    IPostGetCountSchema,
    IPostGetWithIdSchema,
    IPostGetManySchema,
    IPostPostSchema,
    IPostPutWithIdSchema,
    IPostPutManyStatusSchema,
    IPostPutWithIdRankSchema,
    IPostPutWithIdViewSchema, IPostGetWithURLSchema
} from "../schemas/post.schema";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetWithIdSchema;

        serviceResult.data = await PostService.getOne({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetManySchema;

        serviceResult.data = await PostService.getMany({
            ...reqData.query,
            ...(req.isFromAdminPanel && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetWithURLSchema;

        serviceResult.data = await PostService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetCountSchema;

        serviceResult.data = await PostService.getCount({
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPostSchema;

        let insertData = await PostService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        serviceResult.data = {_id: insertData._id};

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        serviceResult.data = await PostService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateWithIdRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutWithIdRankSchema;

        serviceResult.data = await PostService.updateOneRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateWithIdView = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutWithIdViewSchema;

        serviceResult.data = await PostService.updateOneView({
            ...reqData.params,
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutManyStatusSchema;

        serviceResult.data = await PostService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        serviceResult.data = await PostService.deleteMany({
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

export const PostController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithURL: getWithURL,
    getCount: getCount,
    add: add,
    updateWithId: updateWithId,
    updateWithIdRank: updateWithIdRank,
    updateWithIdView: updateWithIdView,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};