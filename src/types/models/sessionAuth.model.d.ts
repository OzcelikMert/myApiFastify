import {UserRoleId} from "../../constants/userRoles";
import { ObjectId } from "mongoose"

export interface ISessionAuthUserModel {
    userId: string | ObjectId
    roleId: UserRoleId,
    email: string,
    ip: string,
    token?: string,
    permissions: number[]
    createAt?: string,
    updatedAt?: string
    refreshedAt?: string
}

export interface ISessionAuthModel {
    _id?: string | ObjectId
    user: ISessionAuthUserModel
}