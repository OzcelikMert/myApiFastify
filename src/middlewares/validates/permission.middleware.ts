import {FastifyReply, FastifyRequest, RouteHandlerMethod} from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../../library/api";
import permissionUtil from "../../utils/permission.util";
import logMiddleware from "../log.middleware";

const check = (permissions: number []): RouteHandlerMethod => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let path = req.originalUrl.replace(`/api`, "");

        if (!permissionUtil.checkPermissionPath(
            path,
            req.method,
            req.sessionAuth.user?.roleId ?? 0,
            req.sessionAuth.user?.permissions ?? []
        )) {
            serviceResult.status = false;
            serviceResult.errorCode = ErrorCodes.noPerm;
            serviceResult.statusCode = StatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
};

export default {
    check: check
};
