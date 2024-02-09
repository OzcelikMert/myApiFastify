import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {EndPointPermissionDocument} from "../../types/constants/endPoint.permissions";

const updateGeneral: EndPointPermissionDocument = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateSEO: EndPointPermissionDocument = {
    permissionId: [PermissionId.SEOEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateContactForm: EndPointPermissionDocument = {
    permissionId: [],
    minUserRoleId: UserRoleId.Admin
}

const updateStaticLanguage: EndPointPermissionDocument = {
    permissionId: [PermissionId.StaticLanguage],
    minUserRoleId: UserRoleId.Admin
}

const updateSocialMedia: EndPointPermissionDocument = {
    permissionId: [PermissionId.SettingEdit],
    minUserRoleId: UserRoleId.Admin
}

const updateECommerce: EndPointPermissionDocument = {
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