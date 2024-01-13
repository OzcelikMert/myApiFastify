import {ErrorCodes, Result, StatusCodes} from "../library/api";
import { AuthSchemaPostDocument } from "../schemas/auth.schema";
import userService from "../services/user.service";
import {StatusId} from "../constants/status";
import logMiddleware from "../middlewares/log.middleware";
import userUtil from "../utils/user.util";
import { FastifyReply, FastifyRequest } from "fastify";

const getSession = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        serviceResult.data = await userService.getOne({_id: req.sessionAuth!.user?.userId.toString()});
        reply.status(serviceResult.statusCode).send(serviceResult)
    })
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as AuthSchemaPostDocument;

        let resData = await userService.getOne({
            ...reqData.body
        });

        if(resData){
            let user = resData;
            if(user.statusId == StatusId.Active) {
                let time = new Date().getTime();
                req.sessionAuth!.set("user", {
                    userId: user._id,
                    email: user.email,
                    roleId: user.roleId,
                    ip: req.ip,
                    permissions: user.permissions,
                    token: userUtil.createToken(user._id.toString(), req.ip, time),
                });
            }else {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.noPerm;
                serviceResult.statusCode = StatusCodes.notFound;
            }
            serviceResult.data = resData;
        }else {
            serviceResult.status = false;
            serviceResult.errorCode = ErrorCodes.notFound;
            serviceResult.statusCode = StatusCodes.notFound;
        }

        reply.status(serviceResult.statusCode).send(serviceResult)
    })
};
const logOut = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        req.sessionAuth!.delete();
        reply.status(serviceResult.statusCode).send(serviceResult);
    })
};

export default {
    getSession: getSession,
    login: login,
    logOut: logOut
};