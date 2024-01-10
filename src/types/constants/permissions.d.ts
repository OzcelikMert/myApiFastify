import {PermissionId} from "../../constants/permissions";
import {UserRoleId} from "../../constants/userRoles";

export interface PermissionDocument {
    permissionId: PermissionId[],
    minUserRoleId: UserRoleId
}


