import { ObjectId } from "mongoose"
import {StatusId} from "@constants/status";

export interface INavigationModel {
    _id?: string | ObjectId
    statusId: StatusId,
    parentId?: string | ObjectId
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    rank: number,
    isPrimary: boolean,
    isSecondary: boolean
    contents: INavigationContentModel[]
}

export interface INavigationContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    title?: string,
    url?: string,
}