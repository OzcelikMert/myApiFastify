import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {LogMiddleware} from "@middlewares/log.middleware";
import {UserRoleId} from "@constants/userRoles";
import {PermissionUtil} from "@utils/permission.util";
import {IPostCommentDeleteManySchema, IPostCommentPutWithIdSchema} from "@schemas/postComment.schema";
import {PostCommentService} from "@services/postComment.service";
import {PostService} from "@services/post.service";
import {IPostCommentModel} from "types/models/postComment.model";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostCommentPutWithIdSchema;

        let serviceResult = await PostCommentService.get({
            _id: reqData.params._id,
            postTypeId: reqData.body.postTypeId,
            postId: reqData.body.postId,
        });

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.notFound;
            apiResult.setStatusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostCommentDeleteManySchema;

        let serviceResult = await PostCommentService.getMany({
            _id: reqData.body._id,
            postTypeId: reqData.body.postTypeId,
            postId: reqData.body.postId,
        });

        if (
            serviceResult.length === 0 ||
            (serviceResult.length != reqData.body._id.length)
        ) {
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.notFound;
            apiResult.setStatusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkIsAuthorWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostCommentPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let serviceResult = req.cachedServiceResult as IPostCommentModel;

            if (serviceResult) {
                if (serviceResult.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
                    apiResult.status = false;
                    apiResult.setErrorCode = ApiErrorCodes.noPerm;
                    apiResult.setStatusCode = ApiStatusCodes.forbidden;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkIsAuthorWithIdForPost = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostCommentPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let serviceResult = await PostService.get({
                _id: reqData.body.postId,
                typeId: reqData.body.postTypeId
            });

            if (serviceResult) {
                if (serviceResult.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
                    apiResult.status = false;
                    apiResult.setErrorCode = ApiErrorCodes.noPerm;
                    apiResult.setStatusCode = ApiStatusCodes.forbidden;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

export const PostCommentMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany,
    checkIsAuthorWithId: checkIsAuthorWithId,
    checkIsAuthorWithIdForPost: checkIsAuthorWithIdForPost,
};