import {FastifyReply, FastifyRequest} from "fastify";
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {UserService} from "@services/user.service";
import {StatusId} from "@constants/status";
import {sessionAuthRefreshMinutes, sessionAuthTTLMinutes} from "@configs/session/session.auth.config";
import {SessionAuthUtil} from "@utils/sessinAuth.util";
import {LogMiddleware} from "@middlewares/log.middleware";
import {ISessionAuthUserModel} from "types/models/sessionAuth.model";
import {IUserGetResultService} from "types/services/user.service";

const check = async (req: FastifyRequest, res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        let apiResult = new ApiResult();

        if (req.sessionAuth && req.sessionAuth.user) {
            let user = req.cachedServiceResult as IUserGetResultService;
            if (
                !user ||
                req.sessionAuth._id != SessionAuthUtil.createToken(user._id.toString(), user.password!, req.ip)
            ) {
                await new Promise(resolve => {
                    req.sessionAuth!.delete();
                    resolve(1);
                });
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.notLoggedIn;
                apiResult.statusCode = ApiStatusCodes.unauthorized;
            }
        }else {
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
            if (Number(new Date().diffMinutes(new Date(req.sessionAuth.user.refreshedAt ?? ""))) > sessionAuthTTLMinutes) {
                req.sessionAuth.delete();
            }else {
                let date = new Date();
                let serviceResult = await UserService.get({_id: req.sessionAuth.user.userId.toString(), statusId: StatusId.Active}, false);
                if(serviceResult) {
                    req.cachedServiceResult = serviceResult;
                    let sessionAuthUser: ISessionAuthUserModel = {
                        ...req.sessionAuth.user,
                        userId: serviceResult._id,
                        email: serviceResult.email,
                        name: serviceResult.name,
                        image: serviceResult.image,
                        roleId: serviceResult.roleId,
                        ip: req.ip,
                        permissions: serviceResult.permissions,
                    }

                    if (
                        JSON.stringify(sessionAuthUser) != JSON.stringify(req.sessionAuth.user) ||
                        Number(date.diffMinutes(new Date(req.sessionAuth.user.refreshedAt ?? ""))) > sessionAuthRefreshMinutes
                    ) {
                        req.sessionAuth.set("_id", SessionAuthUtil.createToken(serviceResult._id.toString(), serviceResult.password!, req.ip));
                        req.sessionAuth.set("user", {
                            ...sessionAuthUser,
                            refreshedAt: date
                        });
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
