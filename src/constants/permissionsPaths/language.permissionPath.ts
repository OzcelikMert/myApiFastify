import PagePaths from "../pagePaths";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";
import {UserRoleId} from "../userRoles";

export default [
    {
        path: PagePaths.language().flags(),
        methods: [
            {
                userRoleId: UserRoleId.SuperAdmin,
                method: "GET"
            }
        ]
    },
    {
        path: PagePaths.language().self(),
        methods: [
            {
                userRoleId: UserRoleId.SuperAdmin,
                method: "POST"
            },
            {
                userRoleId: UserRoleId.SuperAdmin,
                method: "PUT"
            }
        ]
    }
] as PermissionPathDocument[]