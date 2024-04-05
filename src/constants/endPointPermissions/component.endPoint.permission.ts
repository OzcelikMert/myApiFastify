import {IEndPointPermission} from "../../types/constants/endPoint.permissions";
import {UserRoleId} from "@constants/userRoles";
import {PermissionId} from "@constants/permissions";

const add: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

const update: IEndPointPermission = {
    permissionId: [PermissionId.ComponentEdit],
    userRoleId: UserRoleId.Editor
}

const remove: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

export const ComponentEndPointPermission = {
    ADD: add,
    UPDATE: update,
    DELETE: remove
}