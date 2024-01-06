import {UserRoleId} from "../../constants/userRoles";

export interface SessionAuthUserDocument{
    _id?: string
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
    user: SessionAuthUserDocument
}