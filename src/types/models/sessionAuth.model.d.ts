import {UserRoleId} from "../../constants/userRoles";

export interface SessionAuthUserDocument{
    userId: string
    roleId: UserRoleId,
    email: string,
    ip: string,
    token?: string,
    permissions: number[]
    createAt?: string,
    updatedAt?: string
}

export interface SessionAuthDocument{
    _id?: string
    user: SessionAuthUserDocument
}