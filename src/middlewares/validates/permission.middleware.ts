import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import logMiddleware from "../log.middleware";
import {EndPointPermissionDocumentFunc, EndPointPermissionDocument} from "../../types/constants/endPoint.permissions";
import permissionUtil from "../../utils/permission.util";

const check = (permission: EndPointPermissionDocument | EndPointPermissionDocumentFunc) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        if(req.sessionAuth.user){
            if (
                !permissionUtil.checkPermissionRoleRank(permissionData.minUserRoleId, req.sessionAuth.user!.roleId) ||
                !(permissionData.permissionId.every(permissionId => req.sessionAuth.user?.permissions.some(userPermissionId => permissionId == userPermissionId)))
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

export default {
    check: check
};
