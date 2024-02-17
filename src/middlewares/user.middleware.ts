import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {UserService} from "../services/user.service";
import {userRoles} from "../constants/userRoles";
import {LogMiddleware} from "./log.middleware";
import {IUserPutOneSchema, IUserPutPasswordSchema} from "../schemas/user.schema";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IUserPutOneSchema;

        let resData = await UserService.getOne({
            _id: reqData.params._id
        });

        if (!resData) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkRoleRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IUserPutOneSchema;
        let userRoleId = 0;

        if (reqData.body.roleId) {
            userRoleId = reqData.body.roleId;
        } else if (reqData.params._id) {
            let user = await UserService.getOne({
                _id: reqData.params._id
            });
            if (user) {
                userRoleId = user.roleId;
            }
        }

        if (userRoleId > 0) {
            if (req.sessionAuth && req.sessionAuth.user) {
                let sessionUserRole = userRoles.findSingle("id", req.sessionAuth.user.roleId);
                let userRole = userRoles.findSingle("id", userRoleId);

                if (
                    (typeof sessionUserRole === "undefined" || typeof userRole === "undefined") ||
                    (userRole.rank >= sessionUserRole.rank)
                ) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ApiErrorCodes.noPerm;
                    serviceResult.statusCode = ApiStatusCodes.notFound;
                }
            }
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkAlreadyEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IUserPutOneSchema;

        if (reqData.body.email) {
            let resData = await UserService.getOne({
                email: reqData.body.email,
                ignoreUserId: reqData.params._id ? [reqData.params._id] : undefined
            });

            if (resData) {
                serviceResult.status = false;
                serviceResult.errorCode = ApiErrorCodes.alreadyData;
                serviceResult.statusCode = ApiStatusCodes.conflict;
            }
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkPasswordWithSessionEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IUserPutPasswordSchema;

        let resData = await UserService.getOne({
            email: req.sessionAuth!.user?.email,
            password: reqData.body.password
        });

        if (!resData) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export const UserMiddleware = {
    checkOne: checkOne,
    checkRoleRank: checkRoleRank,
    checkAlreadyEmail: checkAlreadyEmail,
    checkPasswordWithSessionEmail: checkPasswordWithSessionEmail
};