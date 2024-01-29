import { ObjectId } from "mongoose"
import {PostTypeId} from "../../constants/postTypes";
import {PostTermTypeId} from "../../constants/postTermTypes";
import {StatusId} from "../../constants/status";

export interface PostTermDocument {
    _id: string | ObjectId
    postTypeId: PostTypeId,
    typeId: PostTermTypeId,
    statusId: StatusId,
    mainId?: string | ObjectId
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    rank: number,
    contents: PostTermContentDocument[]
    updatedAt?: string
    createdAt?: string
}

export interface PostTermContentDocument {
    langId: string | ObjectId
    image?: string,
    title?: string,
    shortContent?: string,
    url?: string,
}