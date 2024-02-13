import {UserRoleId} from "../userRoles";
import {IEndPointPermission} from "../../types/constants/endPoint.permissions";

const getFlags: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const add: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const update: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

const remove: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.SuperAdmin
}

export const LanguageEndPointPermission = {
    GET_FLAGS: getFlags,
    ADD: add,
    UPDATE: update,
    DELETE: remove
}