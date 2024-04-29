import { IAuthPostSchema } from "@schemas/auth.schema";
import {UserService} from "@services/user.service";
import {StatusId} from "@constants/status";
import {LogMiddleware} from "@middlewares/log.middleware";
import { FastifyReply, FastifyRequest } from "fastify";
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {ISessionAuthModel} from "types/models/sessionAuth.model";
import {SessionAuthUtil} from "@utils/sessinAuth.util";
import {IUserGetDetailedResultService} from "types/services/user.service";

const getSession = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISessionAuthModel>();

        apiResult.data = {
            _id: req.sessionAuth!._id,
            user: req.sessionAuth!.user!
        };

        await reply.status(apiResult.statusCode).send(apiResult)
    })
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetDetailedResultService>();

        let reqData = req as IAuthPostSchema;

        let user = await UserService.getDetailed({
            ...reqData.body
        });

        if(user){
            if(user.statusId == StatusId.Active) {
                let date = new Date();
                req.sessionAuth?.set("_id", SessionAuthUtil.createToken(user._id.toString(), user.password!, req.ip));

                req.sessionAuth!.set("user", {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    roleId: user.roleId,
                    ip: req.ip,
                    permissions: user.permissions,
                    createdAt: date,
                    updatedAt: date,
                    refreshedAt: date,
                });
            }else {
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.noPerm;
                apiResult.statusCode = ApiStatusCodes.notFound;
            }
            apiResult.data = user;
        }else {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        await reply.status(apiResult.statusCode).send(apiResult)
    })
};

const logOut = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        req.sessionAuth!.delete();
        await reply.status(apiResult.statusCode).send(apiResult);
    })
};

export const AuthController = {
    getSession: getSession,
    login: login,
    logOut: logOut
};