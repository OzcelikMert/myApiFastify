import {PermissionId} from "../permissions";
import {PermissionDocument} from "../../types/constants/permissions";
import {UserRoleId} from "../userRoles";

const add: PermissionDocument = {
    permissionId: [PermissionId.UserAdd],
    minUserRoleId: UserRoleId.Editor
}

const update: PermissionDocument = {
    permissionId: [PermissionId.UserEdit],
    minUserRoleId: UserRoleId.Editor
}

const remove: PermissionDocument = {
    permissionId: [PermissionId.UserDelete],
    minUserRoleId: UserRoleId.Editor
}

export default {
    add: add,
    update: update,
    delete: remove
}