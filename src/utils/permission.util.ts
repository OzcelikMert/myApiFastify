import {FastifyRequest} from "fastify";
import {IEndPointPermission} from "types/constants/endPoint.permissions";
import {PostTypeId} from "@constants/postTypes";
import {PostEndPointPermission} from "@constants/endPointPermissions/post.endPoint.permission";
import {EndPoints} from "@constants/endPoints";
import {userRoles, UserRoleId} from "@constants/userRoles";
import {PermissionId, permissions} from "@constants/permissions";

const getPermissionKeyPrefix = (method: string) => {
    let prefix = "";

    switch (method) {
        case "GET": prefix = "GET_"; break;
        case "POST": prefix = "ADD_"; break;
        case "PUT": prefix = "UPDATE_"; break;
        case "DELETE": prefix = "DELETE_"; break;
    }

    return prefix;
}

const getPostPermission = (req: FastifyRequest) : IEndPointPermission => {
    let reqData = req as any;
    let path = req.originalUrl.replace(`/api`, "");
    let method = req.method.toUpperCase();
    let typeIdKey = path.startsWith(EndPoints.POST_TERM) ? "postTypeId" : "typeId";
    let typeId: PostTypeId = reqData.query[typeIdKey] ?? reqData.body[typeIdKey] ?? 0;
    let permissionKeyPrefix = getPermissionKeyPrefix(method);
    const postTypeIdKey = Object.keys(PostTypeId).find(key => PostTypeId[key as keyof typeof PostTypeId] === typeId) ?? "";

    return (PostEndPointPermission as any)[`${permissionKeyPrefix}${postTypeIdKey.toUpperCase()}`] ?? {permissionId: [], userRoleId: 0};
}

const checkPermissionRoleRank = (targetRoleId: UserRoleId, minRoleId: UserRoleId) => {
    let userRole = userRoles.findSingle("id", targetRoleId);
    let minRole = userRoles.findSingle("id", minRoleId);

    return targetRoleId == UserRoleId.SuperAdmin || (userRole && minRole) && (userRole.rank >= minRole.rank);
}

const checkPermissionId = (targetRoleId: UserRoleId, targetPermissionId: PermissionId[], minPermissionId: PermissionId[]) => {
    return targetRoleId == UserRoleId.SuperAdmin ||
        (minPermissionId.some(permissionId => {
            let foundPermission = permissions.findSingle("id", permissionId);
            if(foundPermission){
                return checkPermissionRoleRank(targetRoleId, foundPermission.minUserRoleId) && targetPermissionId.some(userPermissionId => permissionId == userPermissionId);
            }
            return false;
        }));
}

const filterPermissionId = (targetRoleId: UserRoleId, targetPermissionId: PermissionId[]) => {
    return targetPermissionId.filter(userPermissionId => {
            let foundPermission = permissions.findSingle("id", userPermissionId);
            if(foundPermission){
                return targetRoleId == UserRoleId.SuperAdmin || checkPermissionRoleRank(targetRoleId, foundPermission.minUserRoleId);
            }
            return false;
        });
}

export const PermissionUtil = {
    getPostPermission: getPostPermission,
    checkPermissionRoleRank: checkPermissionRoleRank,
    checkPermissionId: checkPermissionId,
    filterPermissionId: filterPermissionId
}