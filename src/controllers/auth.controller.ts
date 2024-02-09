import { AuthSchemaPostDocument } from "../schemas/auth.schema";
import userService from "../services/user.service";
import {StatusId} from "../constants/status";
import logMiddleware from "../middlewares/log.middleware";
import userUtil from "../utils/user.util";
import { FastifyReply, FastifyRequest } from "fastify";
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";

const getSession = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        serviceResult.data = await userService.getOne({_id: req.sessionAuth!.user?.userId.toString()});
        reply.status(serviceResult.statusCode).send(serviceResult)
    })
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as AuthSchemaPostDocument;

        let user = await userService.getOne({
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
                    token: userUtil.createToken(user._id.toString(), req.ip, time),
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
    await logMiddleware.error(req, reply, async () => {
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