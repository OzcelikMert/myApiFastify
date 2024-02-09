import {UserRoleId} from "../../constants/userRoles";

export interface ISessionAuthUserResultService {
    userId: string
    roleId: UserRoleId,
    email: string,
    ip: string,
    token?: string,
    permissions: number[]
    createAt?: string,
    updatedAt?: string
}

export interface ISessionAuthResultService {
    _id?: string
    user: ISessionAuthUserResultService
}