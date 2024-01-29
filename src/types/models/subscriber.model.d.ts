import { ObjectId } from "mongoose"

export interface SubscriberDocument {
    _id: string | ObjectId
    email: string
    createdAt?: string,
    updatedAt?: string
}