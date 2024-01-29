import {FastifyRequest, FastifyReply} from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import postService from "../services/post.service";
import logMiddleware from "./log.middleware";
import {
    PostSchemaDeleteManyDocument,
    PostSchemaPutDocument
} from "../schemas/post.schema";
import {UserRoleId} from "../constants/userRoles";
import permissionUtil from "../utils/permission.util";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPutDocument;

        let post = await postService.getOne({
            _id: reqData.params._id,
            typeId: reqData.body.typeId
        });

        if (!post) {
            serviceResult.status = false;
            serviceResult.errorCode = ErrorCodes.notFound;
            serviceResult.statusCode = StatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

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
            serviceResult.errorCode = ErrorCodes.notFound;
            serviceResult.statusCode = StatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkOneIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as PostSchemaPutDocument;

        if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
            let post = await postService.getOne({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (post) {
                if (post.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ErrorCodes.noPerm;
                    serviceResult.statusCode = StatusCodes.forbidden;
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
        let serviceResult = new Result();

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
                        serviceResult.errorCode = ErrorCodes.noPerm;
                        serviceResult.statusCode = StatusCodes.forbidden;
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