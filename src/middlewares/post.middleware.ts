import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {PostService} from "@services/post.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IPostDeleteManySchema, IPostPutStatusManySchema, IPostPutWithIdSchema} from "@schemas/post.schema";
import {UserRoleId} from "@constants/userRoles";
import {PermissionUtil} from "@utils/permission.util";
import {PostTypeId} from "@constants/postTypes";
import {IPostModel} from "types/models/post.model";
import {ObjectId} from "mongoose";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        let serviceResult = await PostService.get({
            _id: reqData.params._id,
            typeId: reqData.body.typeId
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

        let reqData = req as IPostDeleteManySchema;

        let serviceResult = await PostService.getMany({
            _id: reqData.body._id,
            typeId: [reqData.body.typeId]
        });

        if (
            serviceResult.length == 0 ||
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

        let reqData = req as IPostPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let serviceResult = req.cachedServiceResult as IPostModel;

            if (
                req.sessionAuth!.user?.userId.toString() != serviceResult.authorId.toString() &&
                !(serviceResult.authors as ObjectId[])?.some(author => author.toString() == req.sessionAuth!.user?.userId.toString())
            ) {
                apiResult.status = false;
                apiResult.setErrorCode = ApiErrorCodes.noPerm;
                apiResult.setStatusCode = ApiStatusCodes.forbidden;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkIsAuthorMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let serviceResult = req.cachedServiceResult as IPostModel[];

            for (const post of serviceResult) {
                if (post.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
                    apiResult.status = false;
                    apiResult.setErrorCode = ApiErrorCodes.noPerm;
                    apiResult.setStatusCode = ApiStatusCodes.forbidden;
                    break;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkPermissionWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        let serviceResult = req.cachedServiceResult as IPostModel;

        if (
            req.sessionAuth!.user?.userId.toString() != serviceResult.authorId.toString() &&
            !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)
        ) {
            let reqToCheck = {
                authors: reqData.body.authors,
                statusId: reqData.body.statusId
            };

            let serviceToCheck = {
                authors: serviceResult.authors,
                statusId: serviceResult.statusId
            };

            if(JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)){
                apiResult.status = false;
                apiResult.setErrorCode = ApiErrorCodes.noPerm;
                apiResult.setStatusCode = ApiStatusCodes.forbidden;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkPermissionForPageWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        if(reqData.body.typeId == PostTypeId.Page && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)){
            let serviceResult = req.cachedServiceResult as IPostModel;

            let reqToCheck = {
                pageTypeId: reqData.body.pageTypeId,
                isNoIndex: reqData.body.isNoIndex,
                statusId: reqData.body.statusId
            }

            let serviceToCheck = {
                pageTypeId: serviceResult.pageTypeId,
                isNoIndex: serviceResult.isNoIndex,
                statusId: serviceResult.statusId
            }

            if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
                apiResult.status = false;
                apiResult.setErrorCode = ApiErrorCodes.noPerm;
                apiResult.setStatusCode = ApiStatusCodes.forbidden;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkUserRoleForPage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutStatusManySchema;

        if(reqData.body.typeId == PostTypeId.Page && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)){
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.noPerm;
            apiResult.setStatusCode = ApiStatusCodes.forbidden;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

export const PostMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany,
    checkIsAuthorWithId: checkIsAuthorWithId,
    checkIsAuthorMany: checkIsAuthorMany,
    checkPermissionWithId: checkPermissionWithId,
    checkPermissionForPageWithId: checkPermissionForPageWithId,
    checkUserRoleForPage: checkUserRoleForPage
};