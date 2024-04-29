import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {IEndPointPermissionFunc, IEndPointPermission} from "types/constants/endPoint.permissions";
import {PermissionUtil} from "@utils/permission.util";
import {LogMiddleware} from "@middlewares/log.middleware";
import {UserRoleId} from "@constants/userRoles";
import {IUserModel} from "types/models/user.model";

const check = (permission: IEndPointPermission | IEndPointPermissionFunc) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let permissionData = typeof permission == "function" ? permission(req) : permission;

        let user = req.cachedServiceResult as IUserModel;

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

const checkUserRole = (roleId: UserRoleId) => async (req: FastifyRequest, res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
        let apiResult = new ApiResult();

        if (req.sessionAuth && req.sessionAuth.user) {
           if(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth.user.roleId, roleId)){
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
            res.status(apiResult.statusCode).send(apiResult)
        }
    });
};


export const PermissionMiddleware = {
    check: check,
    checkUserRole: checkUserRole
};
