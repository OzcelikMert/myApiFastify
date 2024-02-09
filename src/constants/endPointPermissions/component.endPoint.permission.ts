import {UserRoleId} from "../userRoles";
import {PermissionId} from "../permissions";
import {IEndPointPermission} from "../../types/constants/endPoint.permissions";

const add: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const update: IEndPointPermission = {
    permissionId: [PermissionId.ComponentEdit],
    minUserRoleId: UserRoleId.Editor
}

const remove: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

export const ComponentEndPointPermission = {
    ADD: add,
    UPDATE: update,
    DELETE: remove
}