import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {IEndPointPermission} from "../../types/constants/endPoint.permissions";

const updateGeneral: IEndPointPermission = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateSEO: IEndPointPermission = {
    permissionId: [PermissionId.SEOEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateContactForm: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.Admin
}

const updateStaticLanguage: IEndPointPermission = {
    permissionId: [PermissionId.StaticLanguage],
    minUserRoleId: UserRoleId.Admin
}

const updateSocialMedia: IEndPointPermission = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateECommerce: IEndPointPermission = {
    permissionId: [],
    minUserRoleId: UserRoleId.Admin
}

export const SettingEndPointPermission = {
    UPDATE_GENERAL: updateGeneral,
    UPDATE_SEO: updateSEO,
    UPDATE_CONTACT_FORM: updateContactForm,
    UPDATE_STATIC_LANGUAGE: updateStaticLanguage,
    UPDATE_SOCIAL_MEDIA: updateSocialMedia,
    UPDATE_ECOMMERCE: updateECommerce
}