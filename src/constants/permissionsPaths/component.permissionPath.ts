import PagePaths from "../pagePaths";
import {UserRoleId} from "../userRoles";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.component().self(),
        methods: [
            {
                userRoleId: UserRoleId.SuperAdmin,
                method: "POST"
            },
            {
                userRoleId: UserRoleId.SuperAdmin,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.ComponentEdit,
                method: "PUT"
            }
        ]
    },
] as PermissionPathDocument[]