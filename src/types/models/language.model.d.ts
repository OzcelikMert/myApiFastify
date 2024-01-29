import { ObjectId } from "mongoose"
import {StatusId} from "../../constants/status";

export interface LanguageDocument {
    _id?: string | ObjectId
    title: string
    image: string
    shortKey: string
    locale: string
    statusId: StatusId
    rank: number
}