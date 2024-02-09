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
} & IUserModel

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
    password: string
} & Omit<IUserModel, "_id"|"password">

export type IUserUpdateOneParamService = {
    _id: string
    roleId?: UserRoleId
    statusId?: StatusId
    name?: string
    email?: string
    permissions?: number[]
} & Omit<IUserModel, "_id"|"roleId"|"statusId"|"name"|"email"|"permissions">

export type IUserDeleteOneParamService = {
    _id: string
}