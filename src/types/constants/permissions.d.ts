import {PermissionId} from "@constants/permissions";
import {UserRoleId} from "@constants/userRoles";

export interface IPermission {
    id: PermissionId,
    minUserRoleId: UserRoleId,
}
