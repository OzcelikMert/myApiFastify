import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {PostService} from "../services/post.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {
    IPostDeleteManySchema,
    IPostGetCountSchema,
    IPostGetOneSchema,
    IPostGetManySchema,
    IPostPostSchema,
    IPostPutOneSchema,
    IPostPutManyStatusSchema,
    IPostPutOneRankSchema,
    IPostPutOneViewSchema, IPostGetOneWithURLSchema
} from "../schemas/post.schema";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetOneSchema;

        serviceResult.data = await PostService.getOne({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
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

        reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getOneWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetOneWithURLSchema;

        serviceResult.data = await PostService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostGetCountSchema;

        serviceResult.data = await PostService.getCount({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
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

        reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutOneSchema;

        serviceResult.data = await PostService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateOneRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutOneRankSchema;

        serviceResult.data = await PostService.updateOneRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateOneView = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutOneViewSchema;

        serviceResult.data = await PostService.updateOneView({
            ...reqData.params,
            ...reqData.body
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
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

        reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        serviceResult.data = await PostService.deleteMany({
            ...reqData.body
        });

        reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

export const PostController = {
    getOne: getOne,
    getMany: getMany,
    getOneWithURL: getOneWithURL,
    getCount: getCount,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank,
    updateOneView: updateOneView,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};