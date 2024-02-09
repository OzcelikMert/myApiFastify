import {FastifyRequest} from "fastify";
import {IEndPointPermission} from "../types/constants/endPoint.permissions";
import {PostTypeId} from "../constants/postTypes";
import {PostEndPointPermission} from "../constants/endPointPermissions/post.endPoint.permission";
import {EndPoints} from "../constants/endPoints";
import UserRoles, {UserRoleId} from "../constants/userRoles";

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

    return (PostEndPointPermission as any)[`${permissionKeyPrefix}${postTypeIdKey.toUpperCase()}`] ?? {permissionId: [], minUserRoleId: 0};
}

const checkPermissionRoleRank = (minRoleId: UserRoleId, targetRoleId: UserRoleId) => {
    let userRole = UserRoles.findSingle("id", targetRoleId);
    let minRole = UserRoles.findSingle("id", UserRoleId.Editor);

    return (userRole && minRole) && (userRole.rank >= minRole.rank);
}

export default {
    getPostPermission: getPostPermission,
    checkPermissionRoleRank: checkPermissionRoleRank
}