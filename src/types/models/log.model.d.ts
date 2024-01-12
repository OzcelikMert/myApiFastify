import { ObjectId } from "mongoose"

export interface LogDocument {
    _id: string | ObjectId
    url: string,
    method: string
    ip: string
    message?: string
    userId?: string | ObjectId
    params?: any
    body?: any
    query?: any
}