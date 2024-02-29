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
import {IPostGetManyResultService, IPostGetOneResultService} from "../types/services/post.service";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IPostGetOneResultService>();

        let reqData = req as IPostGetWithIdSchema;

        let post = await PostService.getOne({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        if(post){
            serviceResult.data = post;
        }

        await reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IPostGetManyResultService[]>();

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
        let serviceResult = new ApiResult<IPostGetOneResultService>();

        let reqData = req as IPostGetWithURLSchema;

        let post = await PostService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        if(post){
            serviceResult.data = post;
        }

        await reply.status(serviceResult.statusCode).send(serviceResult);
    })
}

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<number>();

        let reqData = req as IPostGetCountSchema;

        let postCount = await PostService.getCount({
            ...reqData.query
        });

        if(postCount){
            serviceResult.data = postCount;
        }

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPostSchema;

        await PostService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        await reply.status(serviceResult.statusCode).send(serviceResult);
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        await PostService.updateOne({
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

        await PostService.updateOneRank({
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

        await PostService.updateOneView({
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

        await PostService.updateManyStatus({
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

        await PostService.deleteMany({
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