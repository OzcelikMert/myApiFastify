import PagePaths from "../pagePaths";
import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.setting().general(),
        methods: [
            {
                permissionId: PermissionId.SettingEdit,
                method: "PUT"
            }
        ]
    },
    {
        path: PagePaths.setting().seo(),
        methods: [
            {
                permissionId: PermissionId.SeoEdit,
                method: "PUT"
            }
        ]
    },
    {
        path: PagePaths.setting().contactForm(),
        methods: [
            {
                userRoleId: UserRoleId.Admin,
                method: "PUT"
            }
        ]
    },
    {
        path: PagePaths.setting().staticLanguage(),
        methods: [
            {
                permissionId: PermissionId.StaticLanguage,
                method: "PUT"
            }
        ]
    },
    {
        path: PagePaths.setting().socialMedia(),
        methods: [
            {
                permissionId: PermissionId.SettingEdit,
                method: "PUT"
            }
        ]
    },
    {
        path: PagePaths.setting().eCommerce(),
        methods: [
            {
                userRoleId: UserRoleId.Admin,
                method: "PUT"
            }
        ]
    }
] as PermissionPathDocument[]