import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {PostTermService} from "@services/postTerm.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IPostTermDeleteManySchema, IPostTermPutWithIdSchema} from "@schemas/postTerm.schema";
import {UserRoleId} from "@constants/userRoles";
import {PermissionUtil} from "@utils/permission.util";
import {IPostTermModel} from "types/models/postTerm.model";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostTermPutWithIdSchema;

        let serviceResult = await PostTermService.get({
            _id: reqData.params._id,
            postTypeId: reqData.body.postTypeId,
            typeId: reqData.body.typeId,
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

        let reqData = req as IPostTermDeleteManySchema;

        let serviceResult = await PostTermService.getMany({
            _id: reqData.body._id,
            postTypeId: reqData.body.postTypeId,
            typeId: [reqData.body.typeId],
        });

        if (
            serviceResult.length === 0 ||
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

        let reqData = req as IPostTermPutWithIdSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let postTerm = req.cachedServiceResult as IPostTermModel;

            if (postTerm) {
                if (postTerm.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
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

        let reqData = req as IPostTermDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let postTerms = req.cachedServiceResult as IPostTermModel[];

            if (postTerms) {
                for (const postTerm of postTerms) {
                    if (postTerm.authorId.toString() != req.sessionAuth!.user?.userId.toString()) {
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

export const PostTermMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany,
    checkIsAuthorWithId: checkIsAuthorWithId,
    checkIsAuthorMany: checkIsAuthorMany,
};