import {IEndPointPermission} from "../../types/constants/endPoint.permissions";
import {PermissionId} from "@constants/permissions";
import {UserRoleId} from "@constants/userRoles";

const add: IEndPointPermission = {
    permissionId: [PermissionId.UserAdd],
    userRoleId: UserRoleId.Editor
}

const update: IEndPointPermission = {
    permissionId: [PermissionId.UserEdit],
    userRoleId: UserRoleId.Editor
}

const remove: IEndPointPermission = {
    permissionId: [PermissionId.UserDelete],
    userRoleId: UserRoleId.Editor
}

export const UserEndPointPermission = {
    ADD: add,
    UPDATE: update,
    DELETE: remove
}