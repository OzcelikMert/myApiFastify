import {UserRoleId} from "../../constants/userRoles";
import { ObjectId } from "mongoose"

export interface SessionAuthUserDocument{
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

export interface SessionAuthDocument{
    _id?: string | ObjectId
    user: SessionAuthUserDocument
}