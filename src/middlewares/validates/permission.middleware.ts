import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {LogMiddleware} from "../log.middleware";
import {IEndPointPermissionFunc, IEndPointPermission} from "../../types/constants/endPoint.permissions";
import {PermissionUtil} from "../../utils/permission.util";
import {UserService} from "../../services/user.service";

const check = (permission: IEndPointPermission | IEndPointPermissionFunc) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        let user = await UserService.getOne({_id: req.sessionAuth!.user!.userId.toString()});

        if(user){
            if (
                !PermissionUtil.checkPermissionRoleRank(user.roleId, permissionData.userRoleId) ||
                !PermissionUtil.checkPermissionId(user.permissions, permissionData.permissionId)
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
