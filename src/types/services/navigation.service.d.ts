import {UserPopulateDocument} from "./user.service";
import {NavigationContentDocument, NavigationDocument} from "../models/navigation.model";
import {StatusId} from "../../constants/status";

export interface NavigationPopulateDocument {
    _id:  string
    contents: {
        langId: string
        title: string,
        url: string,
    }
}

export type NavigationGetResultDocument = {
    authorId: UserPopulateDocument,
    lastAuthorId: UserPopulateDocument,
    mainId?: NavigationPopulateDocument,
    contents?: NavigationContentDocument | NavigationContentDocument[]
} & Omit<NavigationDocument, "contents">

export interface NavigationGetOneParamDocument {
    _id?: string
    langId?: string
    statusId?: StatusId
}

export interface NavigationGetManyParamDocument {
    _id?: string[]
    langId?: string
    statusId?: StatusId
    ignoreDefaultLanguage?: boolean
}

export type NavigationAddParamDocument = {
    contents?: Omit<NavigationContentDocument, "_id">
} & Omit<NavigationDocument, "_id"|"contents">

export type NavigationUpdateOneParamDocument = {
    _id: string
} & Omit<NavigationAddParamDocument, "authorId">

export type NavigationUpdateOneRankParamDocument = {
    _id: string
    rank: number,
    lastAuthorId: string
}

export type NavigationUpdateManyStatusIdParamDocument = {
    _id: string[],
    statusId: StatusId,
    lastAuthorId: string
}

export interface NavigationDeleteManyParamDocument {
    _id: string[]
}