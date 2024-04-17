import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "@library/api/result";
import {PostService} from "@services/post.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {
    IPostDeleteManySchema,
    IPostGetCountSchema,
    IPostGetManySchema, IPostGetPrevNextWithURLSchema,
    IPostGetWithIdSchema,
    IPostGetWithURLSchema,
    IPostPostSchema,
    IPostPutRankWithIdSchema,
    IPostPutStatusManySchema,
    IPostPutViewWithIdSchema,
    IPostPutWithIdSchema,
} from "@schemas/post.schema";
import {PermissionUtil} from "@utils/permission.util";
import {UserRoleId} from "@constants/userRoles";
import {
    IPostGetManyResultService,
    IPostGetPrevNextResultService,
    IPostGetResultService
} from "types/services/post.service";
import {IPostModel} from "types/models/post.model";
import {PageTypeId} from "@constants/pageTypes";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetResultService>();

        let reqData = req as IPostGetWithIdSchema;

        apiResult.data = await PostService.get({
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
        let apiResult = new ApiResult<IPostGetResultService>();

        let reqData = req as IPostGetWithURLSchema;

        apiResult.data = await PostService.get({
            ...reqData.params,
            ...reqData.query,
            url: reqData.query.pageTypeId && reqData.query.pageTypeId != PageTypeId.Default ? undefined : reqData.params.url
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getPrevNextWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{prev?: IPostGetPrevNextResultService | null, next?: IPostGetPrevNextResultService | null }>();

        let reqData = req as IPostGetPrevNextWithURLSchema;

        apiResult.data = {
            prev: await PostService.getPrevNext({
                ...reqData.query,
                prevId: reqData.params._id
            }),
            next: await PostService.getPrevNext({
                ...reqData.query,
                nextId: reqData.params._id
            })
        };

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
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        await PostService.update({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutRankWithIdSchema;

        await PostService.updateRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateViewWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutViewWithIdSchema;

        await PostService.updateView({
            ...reqData.params,
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutStatusManySchema;

        await PostService.updateStatusMany({
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
    getPrevNextWithId: getPrevNextWithId,
    getCount: getCount,
    add: add,
    updateWithId: updateWithId,
    updateRankWithId: updateRankWithId,
    updateViewWithId: updateViewWithId,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany
};