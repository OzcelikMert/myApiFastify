import { ObjectId } from "mongoose"

export interface UserDocument {
    _id: string | ObjectId
    roleId: number,
    statusId: number,
    name: string,
    email: string,
    image?: string,
    url?: string,
    comment?: string,
    phone?: string,
    password?: string,
    permissions: number[],
    banDateEnd?: Date,
    banComment?: string,
    facebook?: string,
    instagram?: string,
    twitter?: string
}