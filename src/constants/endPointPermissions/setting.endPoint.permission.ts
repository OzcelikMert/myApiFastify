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

const updateSocialMedia: IEndPointPermission = {
    permissionId: [PermissionId.SettingEdit],
    userRoleId: UserRoleId.Admin
}

const updateECommerce: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.Admin
}

const updatePath: IEndPointPermission = {
    permissionId: [],
    userRoleId: UserRoleId.SuperAdmin
}

export const SettingEndPointPermission = {
    UPDATE_GENERAL: updateGeneral,
    UPDATE_SEO: updateSEO,
    UPDATE_CONTACT_FORM: updateContactForm,
    UPDATE_SOCIAL_MEDIA: updateSocialMedia,
    UPDATE_ECOMMERCE: updateECommerce,
    UPDATE_PATH: updatePath
}