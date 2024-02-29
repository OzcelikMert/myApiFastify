import { IAuthPostSchema } from "../schemas/auth.schema";
import {UserService} from "../services/user.service";
import {StatusId} from "../constants/status";
import {LogMiddleware} from "../middlewares/log.middleware";
import {UserUtil} from "../utils/user.util";
import { FastifyReply, FastifyRequest } from "fastify";
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {ISessionAuthModel} from "../types/models/sessionAuth.model";
import {IUserGetResultService} from "../types/services/user.service";

const getSession = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISessionAuthModel>();

        serviceResult.data = {
            _id: req.sessionAuth!._id,
            user: req.sessionAuth!.user!
        };

        await reply.status(serviceResult.statusCode).send(serviceResult)
    })
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IUserGetResultService>();

        let reqData = req as IAuthPostSchema;

        let user = await UserService.getOne({
            ...reqData.body
        });

        if(user){
            if(user.statusId == StatusId.Active) {
                let date = new Date();
                req.sessionAuth?.set("_id", UserUtil.createToken(user._id.toString(), req.ip, date.getTime()));

                req.sessionAuth!.set("user", {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    roleId: user.roleId,
                    ip: req.ip,
                    permissions: user.permissions,
                    refreshedAt: date.toString(),
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

        await reply.status(serviceResult.statusCode).send(serviceResult)
    })
};

const logOut = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        req.sessionAuth!.delete();
        await reply.status(serviceResult.statusCode).send(serviceResult);
    })
};

export const AuthController = {
    getSession: getSession,
    login: login,
    logOut: logOut
};