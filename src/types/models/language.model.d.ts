import { ObjectId } from "mongoose"
import {StatusId} from "../../constants/status";

export interface ILanguageModel {
    _id?: string | ObjectId
    title: string
    image: string
    shortKey: string
    locale: string
    statusId: StatusId
    rank: number
    isDefault: boolean
}