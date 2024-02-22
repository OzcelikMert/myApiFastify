import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {PostTermService} from "../services/postTerm.service";
import {LogMiddleware} from "./log.middleware";
import {IPostTermDeleteManySchema, IPostTermPutOneSchema} from "../schemas/postTerm.schema";
import {UserRoleId} from "../constants/userRoles";
import {PermissionUtil} from "../utils/permission.util";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IPostTermPutOneSchema;

        let resData = await PostTermService.getOne({
            _id: reqData.params._id,
            postTypeId: reqData.body.postTypeId,
            typeId: reqData.body.typeId,
        });

        if (!resData) {
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

        let reqData = req as IPostTermDeleteManySchema;

        let resData = await PostTermService.getMany({
            _id: reqData.body._id,
            postTypeId: reqData.body.postTypeId,
            typeId: [reqData.body.typeId],
        });

        if (
            resData.length === 0 ||
            (resData.length != reqData.body._id.length)
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

        let reqData = req as IPostTermPutOneSchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let postTerm = await PostTermService.getOne({
                _id: reqData.params._id,
                postTypeId: reqData.body.postTypeId,
                typeId: reqData.body.typeId,
            });

            if (postTerm) {
                if (postTerm.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
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

        let reqData = req as IPostTermDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let postTerms = await PostTermService.getMany({
                _id: reqData.body._id,
                postTypeId: reqData.body.postTypeId,
                typeId: [reqData.body.typeId],
            });

            if (postTerms) {
                for (const postTerm of postTerms) {
                    if (postTerm.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
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

export const PostTermMiddleware = {
    checkOne: checkOne,
    checkMany: checkMany,
    checkOneIsAuthor: checkOneIsAuthor,
    checkManyIsAuthor: checkManyIsAuthor,
};