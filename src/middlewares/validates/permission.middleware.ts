import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {LogMiddleware} from "../log.middleware";
import {IEndPointPermissionFunc, IEndPointPermission} from "../../types/constants/endPoint.permissions";
import {PermissionUtil} from "../../utils/permission.util";

const check = (permission: IEndPointPermission | IEndPointPermissionFunc) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        if(req.sessionAuth.user){
            if (
                !PermissionUtil.checkPermissionRoleRank(permissionData.minUserRoleId, req.sessionAuth.user!.roleId) ||
                !PermissionUtil.checkPermissionId(permissionData.permissionId, req.sessionAuth.user!.permissions)
            ) {
                serviceResult.status = false;
                serviceResult.errorCode = ApiErrorCodes.noPerm;
                serviceResult.statusCode = ApiStatusCodes.forbidden;
            }
        }else {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notLoggedIn;
            serviceResult.statusCode = ApiStatusCodes.unauthorized;
        }


        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
};

export const PermissionMiddleware = {
    check: check
};
