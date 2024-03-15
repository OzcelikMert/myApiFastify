import {IUserPopulateService} from "./user.service";
import {IPostTermPopulateService} from "./postTerm.service";
import {
    IPostContentModel,
    IPostModel,
    IPostECommerceModel,
    IPostECommerceVariationContentModel,
    IPostECommerceVariationModel
} from "../models/post.model";
import {PostTypeId} from "../../constants/postTypes";
import {PageTypeId} from "../../constants/pageTypes";
import {StatusId} from "../../constants/status";
import {IComponentModel} from "../models/component.model";

export interface IPostAlternateService {
    langId: string
    title?: string,
    url?: string
}

export type IPostGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    authors?: IUserPopulateService[]
    components?: IComponentModel[]
    views?: number,
    categories?: IPostTermPopulateService[]
    tags?: IPostTermPopulateService[]
    contents?: IPostContentModel | IPostContentModel[]
    alternates?: IPostAlternateService[]
    eCommerce?: (Omit<IPostECommerceModel<IPostTermPopulateService, IPostTermPopulateService[]>, "variations"> & {
        variations?: (Omit<IPostECommerceVariationModel<IPostTermPopulateService>, "contents"> & {
            contents?: IPostECommerceVariationContentModel | IPostECommerceVariationContentModel[]
            alternates?: IPostAlternateService[]
        })[]
    })
} & Omit<IPostModel, "authorId"|"lastAuthorId"|"contents"|"categories"|"tags"|"components"|"eCommerce"|"authors">

export type IPostGetManyResultService = {
    eCommerce?: (Omit<IPostECommerceModel, "variations"> & {
        variations?: (Omit<IPostECommerceVariationModel, "contents"> & {
            contents?: IPostECommerceVariationContentModel | IPostECommerceVariationContentModel[]
            alternates?: IPostAlternateService[]
        })[]
    })
    components?: string[]
} & Omit<IPostGetResultService, "eCommerce"|"components">

export interface IPostGetParamService {
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

export type IPostUpdateParamService = {
    _id: string
    contents?: IPostContentModel
} & Omit<IPostAddParamService, "authorId"|"contents">

export type IPostUpdateRankParamService = {
    _id: string
    typeId: PostTypeId
    rank: number
    lastAuthorId: string
}

export type IPostUpdateViewParamService = {
    _id: string,
    typeId: PostTypeId
    langId: string
}

export type IPostUpdateStatusManyParamService = {
    _id: string[],
    typeId: PostTypeId
    statusId: StatusId,
    lastAuthorId: string
}

export interface IPostDeleteManyParamService {
    _id: string[]
    typeId: PostTypeId
}