import PagePaths from "../pagePaths";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.gallery(),
        methods: [
            {
                permissionId: PermissionId.GalleryEdit,
                method: "PUT"
            },
            {
                permissionId: PermissionId.GalleryEdit,
                method: "DELETE"
            },
        ]
    }
] as PermissionPathDocument[]