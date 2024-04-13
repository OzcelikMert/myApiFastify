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
import {PageTypeId} from "@constants/pageTypes";
import {IPostGetManyResultService, IPostGetResultService} from "types/services/post.service";

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
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
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

        let serviceResult = await PostService.getMany({
            _id: reqData.body._id,
            typeId: [reqData.body.typeId]
        });

        if (
            serviceResult.length == 0 ||
            (serviceResult.length != reqData.body._id.length)
        ) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
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
            let serviceResult = req.cachedServiceResult as IPostGetResultService;

            if (
                req.sessionAuth!.user?.userId.toString() != serviceResult.authorId._id.toString() &&
                !serviceResult.authors?.some(author => author._id == req.sessionAuth!.user?.userId.toString())
            ) {
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.noPerm;
                apiResult.statusCode = ApiStatusCodes.forbidden;
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
            let serviceResult = req.cachedServiceResult as IPostGetManyResultService[];

            for (const post of serviceResult) {
                if (post.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
                    apiResult.status = false;
                    apiResult.errorCode = ApiErrorCodes.noPerm;
                    apiResult.statusCode = ApiStatusCodes.forbidden;
                    break;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkAuthorsWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let serviceResult = req.cachedServiceResult as IPostGetResultService;

            if(
                // Check is author
                req.sessionAuth!.user?.userId.toString() != serviceResult.authorId._id.toString() &&
                // Check post authors data
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

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkPermissionForPageWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        if(reqData.body.typeId == PostTypeId.Page && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)){
            let serviceResult = req.cachedServiceResult as IPostGetResultService;

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
                apiResult.errorCode = ApiErrorCodes.noPerm;
                apiResult.statusCode = ApiStatusCodes.forbidden;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkUserRoleForPage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutStatusManySchema;

        if(reqData.body.typeId == PostTypeId.Page && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)){
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.noPerm;
            apiResult.statusCode = ApiStatusCodes.forbidden;
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
    checkAuthorsWithId: checkAuthorsWithId,
    checkPermissionForPageWithId: checkPermissionForPageWithId,
    checkUserRoleForPage: checkUserRoleForPage
};