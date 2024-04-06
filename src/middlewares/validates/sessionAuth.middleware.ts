import {FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {UserService} from "@services/user.service";
import {StatusId} from "@constants/status";
import {sessionAuthRefreshSeconds, sessionAuthTTL} from "@configs/session/session.auth.config";
import {SessionAuthUtil} from "@utils/sessinAuth.util";
import {LogMiddleware} from "@middlewares/log.middleware";

const check = async (req: FastifyRequest, res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        let apiResult = new ApiResult();

        if (req.sessionAuth && req.sessionAuth.user) {
            let user = await UserService.get({_id: req.sessionAuth.user.userId.toString(), statusId: StatusId.Active}, false);
            if (
                !user ||
                req.sessionAuth._id != SessionAuthUtil.createToken(user._id.toString(), user.password!, req.ip)
            ) {
                await new Promise(resolve => {
                    req.sessionAuth!.delete();
                    resolve(1);
                });
            }
        }


        if ((typeof req.sessionAuth === "undefined" || typeof req.sessionAuth.user === "undefined")) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notLoggedIn;
            apiResult.statusCode = ApiStatusCodes.unauthorized;
        }

        if (!apiResult.status) {
            res.status(apiResult.statusCode).send(apiResult)
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
            if (Number(date.diffSeconds(new Date(req.sessionAuth.user.refreshedAt ?? ""))) > sessionAuthRefreshSeconds) {
                let user = await UserService.get({
                    _id: req.sessionAuth.user.userId.toString()
                }, false);
                if (user) {
                    req.sessionAuth?.set("_id", SessionAuthUtil.createToken(user._id.toString(), user.password!, req.ip));

                    req.sessionAuth.set("user", {
                        userId: user._id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        roleId: user.roleId,
                        ip: req.ip,
                        permissions: user.permissions,
                        refreshedAt: date
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
