import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {PermissionDocument} from "../../types/constants/permissions";

const get: PermissionDocument = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

export default {
    get: get
}