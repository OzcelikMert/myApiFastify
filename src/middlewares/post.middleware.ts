import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {PostService} from "../services/post.service";
import {LogMiddleware} from "./log.middleware";
import {
    IPostDeleteManySchema,
    IPostPutOneSchema
} from "../schemas/post.schema";
import {UserRoleId} from "../constants/userRoles";
import {PermissionUtil} from "../utils/permission.util";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutOneSchema;

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

const checkOneIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostPutOneSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let post = await PostService.getOne({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (post) {
                if (post.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
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
                    if (post.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
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
    checkOne: checkOne,
    checkMany: checkMany,
    checkOneIsAuthor: checkOneIsAuthor,
    checkManyIsAuthor: checkManyIsAuthor,
};