import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {IEndPointPermission} from "../../types/constants/endPoint.permissions";

const updateGeneral: IEndPointPermission = {
    permissionId: [PermissionId.SettingEdit],
    userRoleId: UserRoleId.Admin
}

const updateSEO: IEndPointPermission = {
    permissionId: [PermissionId.SEOEdit],
    userRoleId: UserRoleId.Admin
}

const updateContactForm: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.Admin
}

const updateStaticContent: IEndPointPermission = {
    permissionId: [PermissionId.StaticContent],
    userRoleId: UserRoleId.Admin
}

const updateSocialMedia: IEndPointPermission = {
    permissionId: [PermissionId.SettingEdit],
    userRoleId: UserRoleId.Admin
}

const updateECommerce: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.Admin
}

export const SettingEndPointPermission = {
    UPDATE_GENERAL: updateGeneral,
    UPDATE_SEO: updateSEO,
    UPDATE_CONTACT_FORM: updateContactForm,
    UPDATE_STATIC_CONTENT: updateStaticContent,
    UPDATE_SOCIAL_MEDIA: updateSocialMedia,
    UPDATE_ECOMMERCE: updateECommerce
}