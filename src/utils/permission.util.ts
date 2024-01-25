import {FastifyRequest} from "fastify";
import {PermissionDocument} from "../types/constants/permissions";
import {PostTypeId} from "../constants/postTypes";
import postPermission from "../constants/permissions/post.permission";
import EndPoints from "../constants/endPoints";
import UserRoles, {UserRoleId} from "../constants/userRoles";

const getPermissionKeyPrefix = (method: string) => {
    let prefix = "";

    switch (method) {
        case "GET": prefix = "get"; break;
        case "POST": prefix = "add"; break;
        case "PUT": prefix = "update"; break;
        case "DELETE": prefix = "delete"; break;
    }

    return prefix;
}

export default {
    getPostPermission(req: FastifyRequest) : PermissionDocument {
        let reqData = req as any;
        let path = req.originalUrl.replace(`/api`, "");
        let method = req.method.toUpperCase();
        let typeIdKey = path.startsWith(EndPoints.POST_TERM) ? "postTypeId" : "typeId";
        let typeId: PostTypeId = reqData.query[typeIdKey] ?? reqData.body[typeIdKey] ?? 0;
        let permissionKeyPrefix = getPermissionKeyPrefix(method);
        const postTypeIdKey = Object.keys(PostTypeId).find(key => PostTypeId[key as keyof typeof PostTypeId] === typeId) ?? "";

        return (postPermission as any)[`${permissionKeyPrefix}${postTypeIdKey}`] ?? {permissionId: [], minUserRoleId: 0};
    },
    checkPermissionRoleRank(minRoleId: UserRoleId, targetRoleId: UserRoleId) {
        let userRole = UserRoles.findSingle("id", targetRoleId);
        let minRole = UserRoles.findSingle("id", UserRoleId.Editor);

        return userRole?.rank >= minRole?.rank;
    }
}