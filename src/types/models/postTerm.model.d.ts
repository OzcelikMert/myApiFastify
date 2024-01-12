import { ObjectId } from "mongoose"

export interface PostTermDocument {
    _id: string | ObjectId
    postTypeId: number,
    typeId: number,
    mainId?: string | ObjectId
    statusId: number,
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