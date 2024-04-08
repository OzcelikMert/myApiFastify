import {IEndPointPermission} from "types/constants/endPoint.permissions";
import {PermissionId} from "@constants/permissions";
import {UserRoleId} from "@constants/userRoles";

const get: IEndPointPermission = {
    permissionId: [ PermissionId.SubscriberEdit],
    userRoleId: UserRoleId.Admin
}

const remove: IEndPointPermission = {
    permissionId: [PermissionId.SubscriberEdit],
    userRoleId: UserRoleId.Admin
}

export const SubscriberEndPointPermission = {
    GET: get,
    DELETE: remove
}