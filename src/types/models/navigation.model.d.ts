import { ObjectId } from "mongoose"
import {StatusId} from "../../constants/status";

export interface INavigationModel {
    _id?: string | ObjectId
    statusId: StatusId,
    mainId?: string | ObjectId
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    rank: number,
    contents: INavigationContentModel[]
}

export interface INavigationContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    title?: string,
    url?: string,
}