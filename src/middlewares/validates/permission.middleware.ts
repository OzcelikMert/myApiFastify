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
        let apiResult = new ApiResult();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        let user = await UserService.getOne({_id: req.sessionAuth!.user!.userId.toString()});

        if(user){
            if (
                !PermissionUtil.checkPermissionRoleRank(user.roleId, permissionData.userRoleId) ||
                !PermissionUtil.checkPermissionId(user.roleId, user.permissions, permissionData.permissionId)
            ) {
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.noPerm;
                apiResult.statusCode = ApiStatusCodes.forbidden;
            }
        }else {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notLoggedIn;
            apiResult.statusCode = ApiStatusCodes.unauthorized;
        }


        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
};

export const PermissionMiddleware = {
    check: check
};
