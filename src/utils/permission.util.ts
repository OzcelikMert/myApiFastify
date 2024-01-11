import {FastifyRequest} from "fastify";
import {PermissionDocument} from "../types/constants/permissions";
import {PostTypeId} from "../constants/postTypes";
import postPermission from "../constants/permissions/post.permission";

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
    getPostPermission(req: FastifyRequest) : PermissionDocument{
        let path = req.originalUrl.replace(`/api`, "");
        let method = req.method.toUpperCase();
        let typeIdKey = path.startsWith(EndPoint.POST_TERM) ? "postTypeId" : "typeId";
        let typeId: PostTypeId = req.query[typeIdKey] ?? req.body[typeIdKey] ?? 0;
        let permissionKeyPrefix = getPermissionKeyPrefix(method);
        const postTypeIdKey = Object.keys(PostTypeId).find(key => PostTypeId[key as keyof typeof PostTypeId] === typeId);

        return postPermission[`${permissionKeyPrefix}${postTypeIdKey}`] ?? {permissionId: [], minUserRoleId: 0};
    }
}