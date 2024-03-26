import {IUserModel} from "../models/user.model";
import {StatusId} from "../../constants/status";
import {UserRoleId} from "../../constants/userRoles";
import {PermissionId} from "../../constants/permissions";

export interface IUserPopulateService {
    _id: string
    name: string,
    url: string,
    image: string
}

export type IUserGetResultService = {
    isOnline?: boolean
    password?: string
    authorId?: IUserPopulateService
    lastAuthorId?: IUserPopulateService,
} & Omit<IUserModel, "password"|"authorId"|"lastAuthorId">

export interface IUserGetParamService {
    _id?: string
    email?: string
    password?: string
    statusId?: StatusId
    url?: string
    roleId?: UserRoleId
    ignoreUserId?: string[]
}

export interface IUserGetManyParamService {
    _id?: string[]
    statusId?: StatusId
    email?: string,
    count?: number,
    page?: number
    permissions?: PermissionId[]
    ignoreUserId?: string[]
}

export type IUserAddParamService = {
    image?: string
} & Omit<IUserModel, "_id"|"image">

export type IUserUpdateParamService = {
    _id: string
    roleId?: UserRoleId
    statusId?: StatusId
    name?: string
    email?: string
    permissions?: PermissionId[]
    password?: string
} & Omit<IUserAddParamService, "_id"|"roleId"|"statusId"|"name"|"email"|"permissions"|"password">

export type IUserDeleteParamService = {
    _id: string,
    lastAuthorId: string
}