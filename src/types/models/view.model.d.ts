import { ObjectId } from "mongoose"

export interface IViewModel {
    _id: string | ObjectId
    url: string,
    langId: string | ObjectId
    ip: string,
    country: string,
    city: string,
    region: string
}