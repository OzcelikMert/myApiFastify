import {PermissionId} from "../../constants/permissions";
import {UserRoleId} from "../../constants/userRoles";

export interface PermissionPathMethodDocument {
    method: "POST" | "GET" | "DELETE" | "PUT"
    permissionId?: PermissionId,
    userRoleId?: UserRoleId
}

export interface PermissionPathDocument {
    path: string,
    methods: PermissionPathMethodDocument[]
}


