import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {PostService} from "../services/post.service";
import {LogMiddleware} from "./log.middleware";
import {
    IPostDeleteManySchema,
    IPostPutWithIdSchema
} from "../schemas/post.schema";
import {UserRoleId} from "../constants/userRoles";
import {PermissionUtil} from "../utils/permission.util";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        let post = await PostService.getOne({
            _id: reqData.params._id,
            typeId: reqData.body.typeId
        });

        if (!post) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        let posts = await PostService.getMany({
            _id: reqData.body._id,
            typeId: [reqData.body.typeId]
        });

        if (
            posts.length == 0 ||
            (posts.length != reqData.body._id.length)
        ) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkWithIdIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let post = await PostService.getOne({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (post) {
                if (post.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ApiErrorCodes.noPerm;
                    serviceResult.statusCode = ApiStatusCodes.forbidden;
                }
            }
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkManyIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let posts = await PostService.getMany({
                _id: reqData.body._id,
                typeId: [reqData.body.typeId]
            });

            if (posts) {
                for (const post of posts) {
                    if (post.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
                        serviceResult.status = false;
                        serviceResult.errorCode = ApiErrorCodes.noPerm;
                        serviceResult.statusCode = ApiStatusCodes.forbidden;
                        break;
                    }
                }
            }
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export const PostMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany,
    checkWithIdIsAuthor: checkWithIdIsAuthor,
    checkManyIsAuthor: checkManyIsAuthor,
};