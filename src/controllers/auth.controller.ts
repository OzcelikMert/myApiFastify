import { IAuthPostSchema } from "../schemas/auth.schema";
import {UserService} from "../services/user.service";
import {StatusId} from "../constants/status";
import {LogMiddleware} from "../middlewares/log.middleware";
import {UserUtil} from "../utils/user.util";
import { FastifyReply, FastifyRequest } from "fastify";
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";

const getSession = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        serviceResult.data = await UserService.getOne({_id: req.sessionAuth!.user?.userId.toString()});
        reply.status(serviceResult.statusCode).send(serviceResult)
    })
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IAuthPostSchema;

        let user = await UserService.getOne({
            ...reqData.body
        });

        if(user){
            if(user.statusId == StatusId.Active) {
                let time = new Date().getTime();
                req.sessionAuth.set("user", {
                    userId: user._id,
                    email: user.email,
                    roleId: user.roleId,
                    ip: req.ip,
                    permissions: user.permissions,
                    token: UserUtil.createToken(user._id.toString(), req.ip, time),
                    refreshedAt: (new Date()).toString()
                });
            }else {
                serviceResult.status = false;
                serviceResult.errorCode = ApiErrorCodes.noPerm;
                serviceResult.statusCode = ApiStatusCodes.notFound;
            }
            serviceResult.data = user;
        }else {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
};

const logOut = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        req.sessionAuth!.delete();
        reply.status(serviceResult.statusCode).send(serviceResult);
    })
};

export const AuthController = {
    getSession: getSession,
    login: login,
    logOut: logOut
};