import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../library/api/result";
import {PostService} from "../services/post.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {
    IPostDeleteManySchema,
    IPostGetCountSchema,
    IPostGetManySchema,
    IPostGetWithIdSchema,
    IPostGetWithURLSchema,
    IPostPostSchema,
    IPostPutManyStatusSchema,
    IPostPutWithIdRankSchema,
    IPostPutWithIdSchema,
    IPostPutWithIdViewSchema
} from "../schemas/post.schema";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {IPostGetManyResultService, IPostGetOneResultService} from "../types/services/post.service";
import {IPostModel} from "../types/models/post.model";
import {PageTypeId} from "../constants/pageTypes";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetOneResultService>();

        let reqData = req as IPostGetWithIdSchema;

        apiResult.data = await PostService.getOne({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetManyResultService[]>();

        let reqData = req as IPostGetManySchema;

        apiResult.data = await PostService.getMany({
            ...reqData.query,
            ...(req.isFromAdminPanel && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetOneResultService>();

        let reqData = req as IPostGetWithURLSchema;

        if(reqData.query.pageTypeId == PageTypeId.HomePage){
            delete reqData.params.url;
        }

        apiResult.data = await PostService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<number>();

        let reqData = req as IPostGetCountSchema;

        apiResult.data = await PostService.getCount({
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostModel>();

        let reqData = req as IPostPostSchema;

        apiResult.data = await PostService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        await PostService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            dateStart: new Date(reqData.body.dateStart)
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateWithIdRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdRankSchema;

        await PostService.updateOneRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateWithIdView = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdViewSchema;

        await PostService.updateOneView({
            ...reqData.params,
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutManyStatusSchema;

        await PostService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        await PostService.deleteMany({
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult);
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