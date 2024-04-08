import {IEndPointPermission} from "types/constants/endPoint.permissions";
import {UserRoleId} from "@constants/userRoles";

const getFlags: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

const add: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

const update: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

const remove: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

export const LanguageEndPointPermission = {
    GET_FLAGS: getFlags,
    ADD: add,
    UPDATE: update,
    DELETE: remove
}