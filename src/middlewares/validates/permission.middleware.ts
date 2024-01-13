import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../../library/api";
import logMiddleware from "../log.middleware";
import {PermisisonDocumentFunc, PermissionDocument} from "../../types/constants/permissions";
import UserRoles from "../../constants/userRoles";
import userService from "../../services/user.service";

const check = (permission: PermissionDocument | PermisisonDocumentFunc) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        let user = await userService.getOne({_id: req.sessionAuth.user?.userId.toString()});

        if(user){
            let permissionMinUserRole = UserRoles.findSingle("id", permissionData.minUserRoleId);
            let userRole = UserRoles.findSingle("id", user.roleId);

            if (
                (!permissionMinUserRole || !userRole) ||
                (permissionMinUserRole.rank > userRole.rank) ||
                !(permissionData.permissionId.every(permissionId => user?.permissions.some(userPermissionId => permissionId == userPermissionId)))
            ) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.noPerm;
                serviceResult.statusCode = StatusCodes.notFound;
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
