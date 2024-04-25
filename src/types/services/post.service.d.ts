import {IUserPopulateService} from "types/services/user.service";
import {IPostTermPopulateService} from "types/services/postTerm.service";
import {
    IPostContentModel,
    IPostModel,
    IPostECommerceModel,
    IPostECommerceVariationItemModel
} from "types/models/post.model";
import {PostTypeId} from "@constants/postTypes";
import {PageTypeId} from "@constants/pageTypes";
import {StatusId} from "@constants/status";
import {IComponentModel} from "types/models/component.model";
import {PostSortTypeId} from "@constants/postSortTypes";

export interface IPostPopulateService {
    _id: string
    contents?: Partial<IPostContentModel>
    authorId?: string
    authors?: string[]
    createdAt?: string
    updatedAt?: string
}

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
    eCommerce?: (Omit<IPostECommerceModel<IPostTermPopulateService, IPostTermPopulateService[]>, "variationItems"> & {
        variationItems?: (Omit<IPostECommerceVariationItemModel<IPostTermPopulateService>, "contents"> & {
            alternates?: IPostAlternateService[]
        })[]
    })
} & Omit<IPostModel, "authorId"|"lastAuthorId"|"contents"|"categories"|"tags"|"components"|"eCommerce"|"authors">

export type IPostGetManyResultService = {
    eCommerce?: (Omit<IPostECommerceModel, "variationItems"> & {
        variationItems?: (Omit<IPostECommerceVariationItemModel, "contents"> & {
            alternates?: IPostAlternateService[]
        })[]
    })
    components?: string[]
} & Omit<IPostGetResultService, "eCommerce"|"components">

export interface IPostGetPrevNextResultService {
    _id: string
    contents?: IPostContentModel | IPostContentModel[]
    createdAt: string
}

export interface IPostGetParamService {
    typeId: PostTypeId,
    _id?: string
    pageTypeId?: PageTypeId
    langId?: string
    url?: string
    statusId?: StatusId,
    ignorePostId?: string[]
    authorId?: string
    isIncludePrevAndNext?: boolean
}

export interface IPostGetManyParamService {
    _id?: string[]
    sortTypeId?: PostSortTypeId
    typeId?: PostTypeId[],
    pageTypeId?: PageTypeId[]
    langId?: string
    statusId?: StatusId,
    count?: number,
    page?: number
    ignorePostId?: string[]
    title?: string
    categories?: string[]
    tags?: string[]
    authorId?: string
    dateStart?: Date
}

export interface IPostGetPrevNextParamService {
    typeId: PostTypeId,
    statusId?: StatusId
    prevId?: string
    nextId?: string
    langId?: string
    categories?: string[]
    tags?: string[]
    authorId?: string
}

export interface IPostGetCountParamService {
    typeId: PostTypeId
    statusId?: StatusId
    title?: string
    categories?: string[]
    authorId?: string
}

export type IPostAddParamService = {
    contents: IPostContentModel
} & Omit<IPostModel, "_id"|"views"|"contents">

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
    langId?: string
    url?: string
}

export type IPostUpdateStatusManyParamService = {
    _id: string[],
    typeId?: PostTypeId
    statusId: StatusId,
    lastAuthorId?: string
}

export interface IPostDeleteManyParamService {
    _id: string[]
    typeId: PostTypeId
}