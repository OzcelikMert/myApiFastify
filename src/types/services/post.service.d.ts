import {IUserPopulateService} from "./user.service";
import {IPostTermPopulateService} from "./postTerm.service";
import {
    IPostContentModel,
    IPostModel,
    IPostECommerceModel,
    IPostECommerceVariationContentModel,
    IPostECommerceVariationModel
} from "../models/post.model";
import {IComponentModel} from "../models/component.model";
import {PostTypeId} from "../../constants/postTypes";
import {PageTypeId} from "../../constants/pageTypes";
import {StatusId} from "../../constants/status";

export interface IPostAlternateService {
    langId: string
    title?: string,
    url?: string
}

export type IPostGetOneResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    views?: number,
    categories?: IPostTermPopulateService[]
    tags?: IPostTermPopulateService[]
    contents?: IPostContentModel | IPostContentModel[]
    components?: IComponentModel[],
    alternates?: IPostAlternateService[]
    eCommerce?: (Omit<IPostECommerceModel<IPostTermPopulateService, IPostTermPopulateService[]>, "variations"> & {
        variations?: (Omit<IPostECommerceVariationModel<IPostTermPopulateService>, "contents"> & {
            contents?: IPostECommerceVariationContentModel | IPostECommerceVariationContentModel[]
        })[]
    })
} & Omit<IPostModel, "authorId"|"lastAuthorId"|"contents"|"categories"|"tags"|"components"|"eCommerce">

export type IPostGetManyResultService = {
    components?: IPostModel["components"]
    eCommerce?: (Omit<IPostECommerceModel, "variations"> & {
        variations?: (Omit<IPostECommerceVariationModel, "contents"> & {
            contents?: IPostECommerceVariationContentModel | IPostECommerceVariationContentModel[]
        })[]
    })
} & Omit<IPostGetOneResultService, "eCommerce"|"components">

export interface IPostGetOneParamService {
    typeId: PostTypeId,
    _id?: string
    pageTypeId?: PageTypeId
    langId?: string
    url?: string
    statusId?: StatusId,
    ignorePostId?: string[]
    authorId?: string
}

export interface IPostGetManyParamService {
    _id?: string[]
    isRecent?: boolean
    typeId?: PostTypeId[],
    pageTypeId?: PageTypeId[]
    langId?: string
    statusId?: StatusId,
    count?: number,
    page?: number
    ignorePostId?: string[]
    title?: string
    ignoreDefaultLanguage?: boolean
    categories?: string[]
    authorId?: string
}

export interface IPostGetCountParamService {
    typeId: PostTypeId
    statusId?: StatusId
    title?: string
    categories?: string[]
}

export type IPostAddParamService = {
    contents: IPostContentModel
    eCommerce?: (Omit<IPostECommerceModel, "variations"> & {
        variations?: (Omit<IPostECommerceVariationModel, "contents"> & {
            contents: IPostECommerceVariationContentModel
        })[]
    })
} & Omit<IPostModel, "_id"|"views"|"contents"|"eCommerce">

export type IPostUpdateOneParamService = {
    _id: string
    contents?: IPostContentModel
} & Omit<IPostAddParamService, "authorId"|"contents">

export type IPostUpdateOneRankParamService = {
    _id: string
    typeId: PostTypeId
    rank: number
    lastAuthorId: string
}

export type IPostUpdateOneViewParamService = {
    _id: string,
    typeId: PostTypeId
    langId: string
}

export type IPostUpdateManyStatusIdParamService = {
    _id: string[],
    typeId: PostTypeId
    statusId: StatusId,
    lastAuthorId: string
}

export interface IPostDeleteManyParamService {
    _id: string[]
    typeId: PostTypeId
}