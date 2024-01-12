import { ObjectId } from "mongoose"

export interface LanguageDocument {
    _id?: string | ObjectId
    title: string
    image: string
    shortKey: string
    locale: string
    statusId: number
    rank: number
}