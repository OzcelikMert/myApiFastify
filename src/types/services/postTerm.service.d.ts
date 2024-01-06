import mongoose from "mongoose";
import {UserPopulateDocument} from "./user.service";
import {PostTermContentDocument, PostTermDocument} from "../models/postTerm.model";

export interface PostTermPopulateDocument {
    _id: mongoose.Types.ObjectId | string,
    typeId: number,
    contents: {
        langId: mongoose.Types.ObjectId | string,
        title?: string,
        image?: string
        url?: string
    }[]
}

export interface PostTermAlternateDocument {
    langId: mongoose.Types.ObjectId | string
    title?: string,
    url?: string
}

export type PostTermGetResultDocument = {
    authorId: UserPopulateDocument,
    lastAuthorId: UserPopulateDocument,
    mainId?: {
        _id: mongoose.Types.ObjectId
        contents: {
            langId: mongoose.Types.ObjectId
            title: string,
            url: string,
        }
    },
    contents?: PostTermContentDocument | PostTermContentDocument[]
    alternates?: PostTermAlternateDocument[],
    postCount?: number
} & Omit<PostTermDocument, "contents">

export interface PostTermGetOneParamDocument {
    langId?: string
    _id?: string
    typeId: number,
    postTypeId: number,
    url?: string
    statusId?: number,
    ignoreTermId?: string[],
}

export interface PostTermGetManyParamDocument {
    langId?: string
    _id?: string[]
    typeId?: number[],
    postTypeId: number,
    url?: string
    title?: string
    statusId?: number,
    ignoreTermId?: string[],
    count?: number
    page?: number
    withPostCount?: boolean
    ignoreDefaultLanguage?: boolean
}

export type PostTermAddParamDocument = {
    contents?: PostTermContentDocument
} & Omit<PostTermDocument, "_id"|"contents">

export type PostTermUpdateOneParamDocument = {
    _id: string,
} & Omit<PostTermAddParamDocument, "authorId">

export type PostTermUpdateOneRankParamDocument = {
    _id: string,
    postTypeId: number,
    typeId: number
    rank: number,
    lastAuthorId: string
}

export type PostTermUpdateManyStatusIdParamDocument = {
    _id: string[],
    postTypeId: number,
    typeId: number
    statusId: number,
    lastAuthorId: string
}

export interface PostTermDeleteManyParamDocument {
    _id: string[]
    typeId: number,
    postTypeId: number
}