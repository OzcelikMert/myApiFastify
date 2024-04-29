import {IUserModel} from "types/models/user.model";
import {StatusId} from "@constants/status";
import {UserRoleId} from "@constants/userRoles";
import {PermissionId} from "@constants/permissions";

export interface IUserPopulateService {
    _id: string
    name: string,
    url: string,
    image: string
    facebook?: string
    instagram?: string
    twitter?: string
}

export type IUserGetDetailedResultService = {
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
    permissions?: PermissionId[]
    ignoreUserId?: string[],
    banDateEnd?: Date
}

export interface IUserGetDetailedParamService {
    _id?: string
    email?: string
    password?: string
    statusId?: StatusId
    url?: string
    roleId?: UserRoleId
    ignoreUserId?: string[]
}

export interface IUserGetManyDetailedParamService {
    _id?: string[]
    statusId?: StatusId
    email?: string,
    count?: number,
    page?: number
    permissions?: PermissionId[]
    ignoreUserId?: string[],
    banDateEnd?: Date
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

export type IUserUpdateStatusManyParamService = {
    _id: string[],
    statusId: StatusId,
    lastAuthorId?: string
}

export type IUserDeleteParamService = {
    _id: string,
    lastAuthorId: string
}