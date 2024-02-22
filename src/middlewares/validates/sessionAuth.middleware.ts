import {FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {UserService} from "../../services/user.service";
import {StatusId} from "../../constants/status";
import {sessionAuthRefreshSeconds, sessionAuthTTL} from "../../config/session/session.auth.config";
import {LogMiddleware} from "../log.middleware";
import {UserUtil} from "../../utils/user.util";

const check = async (req: FastifyRequest, res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        let serviceResult = new ApiResult();

        if (req.sessionAuth && req.sessionAuth.user) {
            if (
                req.sessionAuth.user.ip != req.ip ||
                !(await UserService.getOne({_id: req.sessionAuth.user.userId.toString(), statusId: StatusId.Active}))
            ) {
                await new Promise(resolve => {
                    req.sessionAuth!.delete();
                    resolve(1);
                });
            }
        }


        if ((typeof req.sessionAuth === "undefined" || typeof req.sessionAuth.user === "undefined")) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notLoggedIn;
            serviceResult.statusCode = ApiStatusCodes.unauthorized;
        }

        if (!serviceResult.status) {
            res.status(serviceResult.statusCode).send(serviceResult)
        }
    });
};

const reload = async (req: FastifyRequest, res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        if (req.sessionAuth && req.sessionAuth.user) {
            if (Number(new Date().diffSeconds(new Date(req.sessionAuth.user.updatedAt ?? ""))) > sessionAuthTTL) {
                req.sessionAuth.delete();
            }
        }

        if (req.sessionAuth && req.sessionAuth.user) {
            let date = new Date();
            console.log(date, req.sessionAuth.user.refreshedAt, Number(date.diffSeconds(new Date(req.sessionAuth.user.refreshedAt ?? ""))), sessionAuthRefreshSeconds)
            if (Number(date.diffSeconds(new Date(req.sessionAuth.user.refreshedAt ?? ""))) > sessionAuthRefreshSeconds) {
                let user = await UserService.getOne({
                    _id: req.sessionAuth.user.userId.toString()
                });
                if (user) {
                    req.sessionAuth?.set("_id", UserUtil.createToken(user._id.toString(), req.ip, date.getTime()));

                    req.sessionAuth.set("user", {
                        userId: user._id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        roleId: user.roleId,
                        ip: req.ip,
                        permissions: user.permissions,
                        refreshedAt: date.toString()
                    })
                }
            }
        }
    });
};

export const SessionAuthMiddleware = {
    check: check,
    reload: reload
};
