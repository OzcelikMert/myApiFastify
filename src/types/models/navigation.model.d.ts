import { ObjectId } from "mongoose"
import {StatusId} from "../../constants/status";

export interface NavigationDocument {
    _id?: string | ObjectId
    statusId: StatusId,
    mainId?: string | ObjectId
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    rank: number,
    contents: NavigationContentDocument[]
}

export interface NavigationContentDocument {
    _id?: string | ObjectId
    langId: string | ObjectId
    title?: string,
    url?: string,
}