import {UserRoleId} from "../userRoles";
import {PermissionDocument} from "../../types/constants/permissions";

const getFlags: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const add: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const update: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const remove: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

export default {
    getFlags: getFlags,
    add: add,
    update: update,
    delete: remove
}