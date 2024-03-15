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
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        let post = await PostService.get({
            _id: reqData.params._id,
            typeId: reqData.body.typeId
        });

        if (!post) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        let posts = await PostService.getMany({
            _id: reqData.body._id,
            typeId: [reqData.body.typeId]
        });

        if (
            posts.length == 0 ||
            (posts.length != reqData.body._id.length)
        ) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkIsAuthorWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let post = await PostService.get({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (post) {
                if (
                    req.sessionAuth!.user?.userId.toString() != post.authorId._id.toString() &&
                    !post.authors?.some(author => author._id == req.sessionAuth!.user?.userId.toString())
                ) {
                    apiResult.status = false;
                    apiResult.errorCode = ApiErrorCodes.noPerm;
                    apiResult.statusCode = ApiStatusCodes.forbidden;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkIsAuthorMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let posts = await PostService.getMany({
                _id: reqData.body._id,
                typeId: [reqData.body.typeId]
            });

            if (posts) {
                for (const post of posts) {
                    if (post.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
                        apiResult.status = false;
                        apiResult.errorCode = ApiErrorCodes.noPerm;
                        apiResult.statusCode = ApiStatusCodes.forbidden;
                        break;
                    }
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkUpdateAuthorsWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let serviceResult = await PostService.get({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (serviceResult) {
                if(
                    // Check is author
                    req.sessionAuth!.user?.userId.toString() != serviceResult.authorId._id.toString() &&
                    // Check post is authors data
                    reqData.body.authors &&
                    // Check request authors are same with service result authors
                    (
                        reqData.body.authors.length != serviceResult.authors?.length ||
                        !reqData.body.authors.every(reqAuthor => serviceResult?.authors?.some(serviceAuthor => serviceAuthor._id == reqAuthor))
                    )
                ){
                    apiResult.status = false;
                    apiResult.errorCode = ApiErrorCodes.noPerm;
                    apiResult.statusCode = ApiStatusCodes.forbidden;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const PostMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany,
    checkIsAuthorWithId: checkIsAuthorWithId,
    checkIsAuthorMany: checkIsAuthorMany,
    checkUpdateAuthorsWithId: checkUpdateAuthorsWithId
};