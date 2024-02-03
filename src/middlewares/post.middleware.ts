import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import postService from "../services/post.service";
import logMiddleware from "./log.middleware";
import {
    PostSchemaDeleteManyDocument,
    PostSchemaPutOneDocument
} from "../schemas/post.schema";
import {UserRoleId} from "../constants/userRoles";
import permissionUtil from "../utils/permission.util";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as PostSchemaPutOneDocument;

        let post = await postService.getOne({
            _id: reqData.params._id,
            typeId: reqData.body.typeId
        });

        if (!post) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as PostSchemaDeleteManyDocument;

        let posts = await postService.getMany({
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
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkOneIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as PostSchemaPutOneDocument;

        if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
            let post = await postService.getOne({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (post) {
                if (post.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ApiErrorCodes.noPerm;
                    serviceResult.statusCode = ApiStatusCodes.forbidden;
                }
            }
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkManyIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as PostSchemaDeleteManyDocument;

        if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
            let posts = await postService.getMany({
                _id: reqData.body._id,
                typeId: [reqData.body.typeId]
            });

            if (posts) {
                for (const post of posts) {
                    if (post.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                        serviceResult.status = false;
                        serviceResult.errorCode = ApiErrorCodes.noPerm;
                        serviceResult.statusCode = ApiStatusCodes.forbidden;
                        break;
                    }
                }
            }
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export default {
    checkOne: checkOne,
    checkMany: checkMany,
    checkOneIsAuthor: checkOneIsAuthor,
    checkManyIsAuthor: checkManyIsAuthor,
};