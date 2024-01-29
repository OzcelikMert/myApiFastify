import {UserDocument} from "../models/user.model";
import {StatusId} from "../../constants/status";
import {UserRoleId} from "../../constants/userRoles";

export interface UserPopulateDocument {
    _id: string
    name: string,
    url: string,
    image: string
}

export type UserGetResultDocument = {
    isOnline?: boolean
} & UserDocument

export interface UserGetOneParamDocument {
    _id?: string
    email?: string
    password?: string
    statusId?: StatusId
    url?: string
    roleId?: UserRoleId
    ignoreUserId?: string[]
}

export interface UserGetManyParamDocument {
    _id?: string[]
    statusId?: StatusId
    email?: string,
    count?: number,
    page?: number
    roleId?: UserRoleId
    ignoreUserId?: string[]
}

export type UserAddParamDocument = {
    password: string
} & Omit<UserDocument, "_id"|"password">

export type UserUpdateOneParamDocument = {
    _id: string
    roleId?: UserRoleId
    statusId?: StatusId
    name?: string
    email?: string
    permissions?: number[]
} & Omit<UserDocument, "_id"|"roleId"|"statusId"|"name"|"email"|"permissions">

export type UserDeleteOneParamDocument = {
    _id: string
}