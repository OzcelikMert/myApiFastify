import {IUserModel} from "../models/user.model";
import {StatusId} from "../../constants/status";
import {UserRoleId} from "../../constants/userRoles";

export interface IUserPopulateService {
    _id: string
    name: string,
    url: string,
    image: string
}

export type IUserGetResultService = {
    isOnline?: boolean
    password?: string
} & Omit<IUserModel, "password">

export interface IUserGetOneParamService {
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
    roleId?: UserRoleId
    ignoreUserId?: string[]
}

export type IUserAddParamService = {
    image?: string
} & Omit<IUserModel, "_id"|"image">

export type IUserUpdateOneParamService = {
    _id: string
    roleId?: UserRoleId
    statusId?: StatusId
    name?: string
    email?: string
    permissions?: number[]
    password?: string
} & Omit<IUserAddParamService, "_id"|"roleId"|"statusId"|"name"|"email"|"permissions"|"password">

export type IUserDeleteOneParamService = {
    _id: string
}