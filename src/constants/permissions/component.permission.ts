import {UserRoleId} from "../userRoles";
import {PermissionId} from "../permissions";
import {PermissionDocument} from "../../types/constants/permissions";

const add: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const update: PermissionDocument = {
    permissionId: [PermissionId.ComponentEdit],
    minUserRoleId: UserRoleId.Editor
}

const remove: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

export default {
    add: add,
    update: update,
    delete: remove
}