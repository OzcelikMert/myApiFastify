import {IEndPointPermission} from "types/constants/endPoint.permissions";
import {PermissionId} from "@constants/permissions";
import {UserRoleId} from "@constants/userRoles";

const get: IEndPointPermission = {
    permissionId: [PermissionId.SettingEdit],
    userRoleId: UserRoleId.Admin
}

export const ServerInfoEndPointPermission = {
    GET: get
}