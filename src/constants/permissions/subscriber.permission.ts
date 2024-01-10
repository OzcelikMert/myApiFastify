import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {PermissionDocument} from "../../types/constants/permissions";

const get: PermissionDocument = {
    permissionId: [ PermissionId.SubscriberEdit],
    minUserRoleId: UserRoleId.Admin
}

const remove: PermissionDocument = {
    permissionId: [PermissionId.SubscriberEdit],
    minUserRoleId: UserRoleId.Admin
}

export default {
    get: get,
    delete: remove
}