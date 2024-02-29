import {IPermission} from "../types/constants/permissions";
import {UserRoleId} from "./userRoles";

export enum PermissionId {
    BlogAdd = 1,
    BlogEdit,
    BlogDelete,
    PortfolioAdd,
    PortfolioEdit,
    PortfolioDelete,
    SliderAdd,
    SliderEdit,
    SliderDelete,
    ReferenceAdd,
    ReferenceEdit,
    ReferenceDelete,
    UserAdd,
    UserEdit,
    UserDelete,
    PageAdd,
    PageEdit,
    PageDelete,
    NavigationAdd,
    NavigationEdit,
    NavigationDelete,
    SEOEdit,
    SettingEdit,
    ServiceAdd,
    ServiceEdit,
    ServiceDelete,
    TestimonialAdd,
    TestimonialEdit,
    TestimonialDelete,
    SubscriberEdit,
    StaticContent,
    ProductAdd,
    ProductEdit,
    ProductDelete,
    ECommerce,
    BeforeAndAfterAdd,
    BeforeAndAfterEdit,
    BeforeAndAfterDelete,
}

export const permissions: Array<IPermission> = [
    {id: PermissionId.BlogAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.BlogEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.BlogDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.PortfolioAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.PortfolioEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.PortfolioDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.SliderAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.SliderEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.SliderDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ReferenceAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ReferenceEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ReferenceDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ServiceAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ServiceEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ServiceDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.TestimonialAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.TestimonialEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.TestimonialDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.BeforeAndAfterAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.BeforeAndAfterEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.BeforeAndAfterDelete, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.UserAdd, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.UserEdit, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.UserDelete, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.PageAdd, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.PageEdit, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.PageDelete, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.NavigationAdd, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.NavigationEdit, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.NavigationDelete, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.SettingEdit, minUserRoleId: UserRoleId.Admin},
    {id: PermissionId.SEOEdit, minUserRoleId: UserRoleId.Admin},
    {id: PermissionId.StaticContent, minUserRoleId: UserRoleId.Editor},
    {id: PermissionId.SubscriberEdit, minUserRoleId: UserRoleId.Admin},
    {id: PermissionId.ECommerce, minUserRoleId: UserRoleId.Admin},
    {id: PermissionId.ProductAdd, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ProductEdit, minUserRoleId: UserRoleId.Author},
    {id: PermissionId.ProductDelete, minUserRoleId: UserRoleId.Author},
]