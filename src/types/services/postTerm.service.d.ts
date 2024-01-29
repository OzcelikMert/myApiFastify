import {UserPopulateDocument} from "./user.service";
import {PostTermContentDocument, PostTermDocument} from "../models/postTerm.model";
import {PostTermTypeId} from "../../constants/postTermTypes";
import {PostTypeId} from "../../constants/postTypes";
import {StatusId} from "../../constants/status";

export interface PostTermPopulateDocument {
    _id: string,
    typeId: PostTermTypeId,
    contents: {
        langId: string,
        title?: string,
        image?: string
        url?: string
    }
}

export interface PostTermAlternateDocument {
    langId: string
    title?: string,
    url?: string
}

export type PostTermGetResultDocument = {
    authorId: UserPopulateDocument,
    lastAuthorId: UserPopulateDocument,
    mainId?: PostTermPopulateDocument,
    contents?: PostTermContentDocument | PostTermContentDocument[]
    alternates?: PostTermAlternateDocument[],
    postCount?: number
} & Omit<PostTermDocument, "contents">

export interface PostTermGetOneParamDocument {
    langId?: string
    _id?: string
    typeId: PostTermTypeId,
    postTypeId: PostTypeId,
    statusId?: StatusId,
    url?: string
    ignoreTermId?: string[]
    authorId?: string
}

export interface PostTermGetManyParamDocument {
    langId?: string
    _id?: string[]
    typeId?: PostTermTypeId[],
    postTypeId: PostTypeId,
    url?: string
    title?: string
    statusId?: StatusId,
    ignoreTermId?: string[],
    count?: number
    page?: number
    withPostCount?: boolean
    ignoreDefaultLanguage?: boolean
    authorId?: string
}

export type PostTermAddParamDocument = {
    contents?: PostTermContentDocument
} & Omit<PostTermDocument, "_id"|"contents">

export type PostTermUpdateOneParamDocument = {
    _id: string,
} & Omit<PostTermAddParamDocument, "authorId">

export type PostTermUpdateOneRankParamDocument = {
    _id: string,
    postTypeId: PostTypeId,
    typeId: PostTermTypeId
    rank: number,
    lastAuthorId: string
}

export type PostTermUpdateManyStatusIdParamDocument = {
    _id: string[],
    postTypeId: PostTypeId,
    typeId: PostTermTypeId
    statusId: StatusId,
    lastAuthorId: string
}

export interface PostTermDeleteManyParamDocument {
    _id: string[]
    typeId: PostTermTypeId,
    postTypeId: PostTypeId
}