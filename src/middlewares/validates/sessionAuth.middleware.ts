import {FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {ErrorCodes, Result, StatusCodes} from "../../library/api";
import userService from "../../services/user.service";
import {StatusId} from "../../constants/status";
import {sessionAuthTTL} from "../../config/session/session.auth";
import logMiddleware from "../log.middleware";

const check = async (
    req: FastifyRequest,
    res: FastifyReply
) => {
    await logMiddleware.error(req, res, async () => {
        let serviceResult = new Result();

        if (req.sessionAuth && req.sessionAuth.data) {
            if (req.sessionAuth.user?.ip != req.ip) {
                await new Promise(resolve => {
                    req.sessionAuth.delete();
                    resolve();
                })
            }
        }

        if (
            (typeof req.sessionAuth === "undefined" || typeof req.sessionAuth.user === "undefined") ||
            !(await userService.getOne({_id: req.sessionAuth.user?._id, statusId: StatusId.Active}))
        ) {
            serviceResult.status = false;
            serviceResult.errorCode = ErrorCodes.notLoggedIn;
            serviceResult.statusCode = StatusCodes.unauthorized;
        }

        if (serviceResult.status) {
            return;
        } else {
            res.status(serviceResult.statusCode).send(serviceResult)
        }
    });
};

const reload = async (
    req: FastifyRequest,
    res: FastifyReply
) => {
    await logMiddleware.error(req, res, async () => {
        if (req.sessionAuth && req.sessionAuth.data) {
            if (Number(new Date().diffSeconds(new Date(req.sessionAuth.user?.updatedAt ?? ""))) > sessionAuthTTL) {
                await new Promise(resolve => {
                    req.sessionAuth.delete();
                    resolve();
                })
            }
        }
        if (req.sessionAuth && req.sessionAuth.data) {
            req.sessionAuth.data.updatedAt = Date.now();
        }
    });
};

export default {
    check: check,
    reload: reload
};
