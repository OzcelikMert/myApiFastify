import {UserRoleId} from "../userRoles";
import {PermissionId} from "../permissions";
import {EndPointPermissionDocument} from "../../types/constants/endPoint.permissions";

const add: EndPointPermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const update: EndPointPermissionDocument = {
    permissionId: [PermissionId.ComponentEdit],
    minUserRoleId: UserRoleId.Editor
}

const remove: EndPointPermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

export const ComponentEndPointPermission = {
    ADD: add,
    UPDATE: update,
    DELETE: remove
}