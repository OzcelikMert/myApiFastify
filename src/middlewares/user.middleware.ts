import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {UserService} from "../services/user.service";
import {userRoles} from "../constants/userRoles";
import {LogMiddleware} from "./log.middleware";
import {IUserPutWithIdSchema, IUserPutPasswordSchema} from "../schemas/user.schema";
import {PermissionUtil} from "../utils/permission.util";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IUserPutWithIdSchema;

        let serviceResult = await UserService.get({
            _id: reqData.params._id
        });

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkRoleRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IUserPutWithIdSchema;
        let userRoleId = 0;

        if (reqData.body.roleId) {
            userRoleId = reqData.body.roleId;
        } else if (reqData.params._id) {
            let user = await UserService.get({
                _id: reqData.params._id
            });
            if (user) {
                userRoleId = user.roleId;
            }
        }

        if (userRoleId > 0) {
            if (req.sessionAuth && req.sessionAuth.user) {
                let sessionUser = await UserService.get({
                    _id: req.sessionAuth.user.userId.toString()
                });

                if (PermissionUtil.checkPermissionRoleRank(userRoleId, sessionUser!.roleId)) {
                    apiResult.status = false;
                    apiResult.errorCode = ApiErrorCodes.noPerm;
                    apiResult.statusCode = ApiStatusCodes.notFound;
                }
            }else {
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.notLoggedIn;
                apiResult.statusCode = ApiStatusCodes.unauthorized;
            }
        } else {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.incorrectData;
            apiResult.statusCode = ApiStatusCodes.badRequest;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkAlreadyEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IUserPutWithIdSchema;

        if (reqData.body.email) {
            let serviceResult = await UserService.get({
                email: reqData.body.email,
                ignoreUserId: reqData.params._id ? [reqData.params._id] : undefined
            });

            if (serviceResult) {
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.alreadyData;
                apiResult.statusCode = ApiStatusCodes.conflict;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkPasswordWithSessionEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IUserPutPasswordSchema;

        let serviceResult = await UserService.get({
            email: req.sessionAuth!.user?.email,
            password: reqData.body.password
        });

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const UserMiddleware = {
    checkWithId: checkWithId,
    checkRoleRank: checkRoleRank,
    checkAlreadyEmail: checkAlreadyEmail,
    checkPasswordWithSessionEmail: checkPasswordWithSessionEmail
};