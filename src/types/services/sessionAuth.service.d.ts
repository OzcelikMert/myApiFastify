import {UserRoleId} from "../../constants/userRoles";

export interface SessionAuthUserResultDocument{
    userId: string
    roleId: UserRoleId,
    email: string,
    ip: string,
    token?: string,
    permissions: number[]
    createAt?: string,
    updatedAt?: string
}

export interface SessionAuthResultDocument{
    _id?: string
    user: SessionAuthUserResultDocument
}