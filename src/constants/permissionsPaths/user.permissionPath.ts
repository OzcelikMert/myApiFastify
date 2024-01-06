import PagePaths from "../pagePaths";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.user().self(),
        methods: [
            {
                method: "POST",
                permissionId: PermissionId.UserAdd
            }
        ]
    },
    {
        path: PagePaths.user().withId(undefined),
        methods: [
            {
                method: "PUT" ,
                permissionId: PermissionId.UserEdit
            },
            {
                method: "DELETE",
                permissionId: PermissionId.UserDelete
            }
        ]
    }
] as PermissionPathDocument[]