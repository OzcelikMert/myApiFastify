import {IUserPopulateService} from "./user.service";
import {IPostTermContentModel, IPostTermModel} from "../models/postTerm.model";
import {PostTermTypeId} from "../../constants/postTermTypes";
import {PostTypeId} from "../../constants/postTypes";
import {StatusId} from "../../constants/status";

export interface IPostTermPopulateService {
    _id: string,
    typeId: PostTermTypeId,
    contents: {
        langId: string,
        title?: string,
        image?: string
        url?: string
    }
}

export interface IPostTermAlternateService {
    langId: string
    title?: string,
    url?: string
}

export type IPostTermGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    mainId?: IPostTermPopulateService,
    contents?: IPostTermContentModel | IPostTermContentModel[]
    alternates?: IPostTermAlternateService[],
    postCount?: number
} & Omit<IPostTermModel, "contents">

export interface IPostTermGetOneParamService {
    langId?: string
    _id?: string
    typeId: PostTermTypeId,
    postTypeId: PostTypeId,
    statusId?: StatusId,
    url?: string
    ignoreTermId?: string[]
    authorId?: string
}

export interface IPostTermGetManyParamService {
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

export type IPostTermAddParamService = {
    contents?: IPostTermContentModel
} & Omit<IPostTermModel, "_id"|"contents">

export type IPostTermUpdateOneParamService = {
    _id: string,
} & Omit<IPostTermAddParamService, "authorId">

export type IPostTermUpdateOneRankParamService = {
    _id: string,
    postTypeId: PostTypeId,
    typeId: PostTermTypeId
    rank: number,
    lastAuthorId: string
}

export type IPostTermUpdateManyStatusIdParamService = {
    _id: string[],
    postTypeId: PostTypeId,
    typeId: PostTermTypeId
    statusId: StatusId,
    lastAuthorId: string
}

export interface IPostTermDeleteManyParamService {
    _id: string[]
    typeId: PostTermTypeId,
    postTypeId: PostTypeId
}