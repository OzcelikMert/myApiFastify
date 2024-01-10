import {PermissionId} from "../permissions";
import {PermissionDocument} from "../../types/constants/permissions";
import {UserRoleId} from "../userRoles";

const add: PermissionDocument = {
    permissionId: [PermissionId.NavigateAdd],
    minUserRoleId: UserRoleId.Editor
}

const update: PermissionDocument = {
    permissionId: [PermissionId.NavigateEdit],
    minUserRoleId: UserRoleId.Editor
}

const remove: PermissionDocument = {
    permissionId: [PermissionId.NavigateDelete],
    minUserRoleId: UserRoleId.Editor
}

export default {
    add: add,
    update: update,
    delete: remove
}