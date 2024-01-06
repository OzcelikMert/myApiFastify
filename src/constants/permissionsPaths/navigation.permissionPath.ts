import PagePaths from "../pagePaths";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.navigation().self(),
        methods: [
            {
                permissionId: PermissionId.NavigateAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.NavigateDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.NavigateEdit,
                method: "PUT"
            },
        ]
    },
] as PermissionPathDocument[]