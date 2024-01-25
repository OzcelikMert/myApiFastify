import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../../library/api";
import logMiddleware from "../log.middleware";
import {PermisisonDocumentFunc, PermissionDocument} from "../../types/constants/permissions";
import UserRoles, {UserRoleId} from "../../constants/userRoles";
import permissionUtil from "../../utils/permission.util";

const check = (permission: PermissionDocument | PermisisonDocumentFunc) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        if(req.sessionAuth.user){
            if (
                !permissionUtil.checkPermissionRoleRank(permissionData.minUserRoleId, req.sessionAuth.user!.roleId) ||
                !(permissionData.permissionId.every(permissionId => req.sessionAuth.user?.permissions.some(userPermissionId => permissionId == userPermissionId)))
            ) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.noPerm;
                serviceResult.statusCode = StatusCodes.forbidden;
            }
        }else {
            serviceResult.status = false;
            serviceResult.errorCode = ErrorCodes.notLoggedIn;
            serviceResult.statusCode = StatusCodes.unauthorized;
        }


        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
};

export default {
    check: check
};
