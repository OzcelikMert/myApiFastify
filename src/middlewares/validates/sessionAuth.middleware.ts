import {FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {UserService} from "../../services/user.service";
import {StatusId} from "../../constants/status";
import {sessionAuthTTL} from "../../config/session/session.auth.config";
import {LogMiddleware} from "../log.middleware";
import {UserUtil} from "../../utils/user.util";

const check = async (req: FastifyRequest,res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        let serviceResult = new ApiResult();

        if (req.sessionAuth && req.sessionAuth.data() && req.sessionAuth.user) {
            if (req.sessionAuth.user?.ip != req.ip) {
                await new Promise(resolve => {
                    req.sessionAuth!.delete();
                    resolve(1);
                });
            }
        }

        if (
            (typeof req.sessionAuth === "undefined" || typeof req.sessionAuth.user === "undefined") ||
            !(await UserService.getOne({_id: req.sessionAuth.user.userId.toString(), statusId: StatusId.Active}))
        ) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notLoggedIn;
            serviceResult.statusCode = ApiStatusCodes.unauthorized;
        }

        if (serviceResult.status) {
            return;
        } else {
            res.status(serviceResult.statusCode).send(serviceResult)
        }
    });
};

const reload = async (req: FastifyRequest,res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        if (req.sessionAuth && req.sessionAuth.data() && req.sessionAuth.user) {
            if (Number(new Date().diffSeconds(new Date(req.sessionAuth.user.updatedAt ?? ""))) > sessionAuthTTL) {
                req.sessionAuth.delete();
            }
        }
        if (req.sessionAuth && req.sessionAuth.data()) {
            if(req.sessionAuth.user){
                if(Number(new Date().diffSeconds(new Date(req.sessionAuth.user.refreshedAt ?? ""))) > 120) {
                    let user = await UserService.getOne({
                        _id: req.sessionAuth.user.userId.toString()
                    });
                    if(user){
                        let date = new Date();
                        req.sessionAuth.set("user", {
                            userId: user._id,
                            email: user.email,
                            roleId: user.roleId,
                            ip: req.ip,
                            permissions: user.permissions,
                            token: UserUtil.createToken(user._id.toString(), req.ip, date.getTime()),
                            refreshedAt: date.toString()
                        })
                    }
                }
            }
        }
    });
};

export const SessionAuthMiddleware = {
    check: check,
    reload: reload
};
