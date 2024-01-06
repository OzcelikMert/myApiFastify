import PagePaths from "../pagePaths";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.subscriber().self(),
        methods: [
            {
                permissionId: PermissionId.SubscriberEdit,
                method: "GET"
            },
            {
                permissionId: PermissionId.SubscriberEdit,
                method: "DELETE"
            },
        ]
    }
] as PermissionPathDocument[]