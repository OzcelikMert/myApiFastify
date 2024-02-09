import { ObjectId } from "mongoose"

export interface ISubscriberModel {
    _id: string | ObjectId
    email: string
    createdAt?: string,
    updatedAt?: string
}