import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {PermissionDocument} from "../../types/constants/permissions";

const updateGeneral: PermissionDocument = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateSEO: PermissionDocument = {
    permissionId: [PermissionId.SEOEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateContactForm: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.Admin
}

const updateStaticLanguage: PermissionDocument = {
    permissionId: [PermissionId.StaticLanguage],
    minUserRoleId: UserRoleId.Admin
}

const updateSocialMedia: PermissionDocument = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateECommerce: PermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.Admin
}

export default {
    updateGeneral: updateGeneral,
    updateSEO: updateSEO,
    updateContactForm: updateContactForm,
    updateStaticLanguage: updateStaticLanguage,
    updateSocialMedia: updateSocialMedia,
    updateECommerce: updateECommerce
}