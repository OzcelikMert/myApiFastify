import PagePaths from "../pagePaths";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.serverInfo(),
        methods: [
            {
                permissionId: PermissionId.SettingEdit,
                method: "GET"
            },
        ]
    }
] as PermissionPathDocument[]