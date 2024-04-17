import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IPostCommentGetResultService} from "types/services/postComponent.service";
import {
    IPostCommentDeleteManySchema,
    IPostCommentGetManySchema,
    IPostCommentGetWithIdSchema,
    IPostCommentPostSchema,
    IPostCommentPutLikeWithIdSchema,
    IPostCommentPutStatusManySchema,
    IPostCommentPutWithIdSchema
} from "@schemas/postComment.schema";
import {PostCommentService} from "@services/postComment.service";
import {IPostCommentModel} from "types/models/postComment.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostCommentGetResultService>();

        let reqData = req as IPostCommentGetWithIdSchema;

        apiResult.data = await PostCommentService.get({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostCommentGetResultService[]>();

        let reqData = req as IPostCommentGetManySchema;

        apiResult.data = await PostCommentService.getMany({
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostCommentModel>();

        let reqData = req as IPostCommentPostSchema;

        apiResult.data = await PostCommentService.add({
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

        let reqData = req as IPostCommentPutWithIdSchema;

        await PostCommentService.update({
            ...reqData.body,
            ...reqData.params,
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateLikeWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<number>();

        let reqData = req as IPostCommentPutLikeWithIdSchema;

        apiResult.data = await PostCommentService.updateLike({
            ...reqData.body,
            ...reqData.params,
            authorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostCommentPutStatusManySchema;

        await PostCommentService.updateStatusMany({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostCommentDeleteManySchema;

        await PostCommentService.deleteMany({
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const PostCommentController = {
    getWithId: getWithId,
    getMany: getMany,
    add: add,
    updateWithId: updateWithId,
    updateLikeWithId: updateLikeWithId,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany
};