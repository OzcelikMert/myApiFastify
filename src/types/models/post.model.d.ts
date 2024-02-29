import { ObjectId } from "mongoose"
import {PostTypeId} from "../../constants/postTypes";
import {PageTypeId} from "../../constants/pageTypes";
import {StatusId} from "../../constants/status";
import {AttributeTypeId} from "../../constants/attributeTypes";
import {ProductTypeId} from "../../constants/productTypes";

export interface IPostModel {
    _id?: string | ObjectId
    typeId: PostTypeId,
    statusId: StatusId,
    pageTypeId?: PageTypeId,
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    dateStart: Date,
    rank: number,
    isFixed?: boolean,
    categories?: string[]
    tags?: string[]
    contents: IPostContentModel[]
    beforeAndAfter?: IPostBeforeAndAfterModel
    eCommerce?: IPostECommerceModel
    updatedAt?: string
    createdAt?: string
}

export interface IPostContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    image?: string
    icon?: string
    title?: string,
    content?: string,
    shortContent?: string,
    url?: string,
    views?: number,
    buttons?: IPostContentButtonModel[]
}

export interface IPostBeforeAndAfterModel {
    imageBefore: string
    imageAfter: string
    images: string[]
}

export interface IPostContentButtonModel {
    _id?: string | ObjectId
    title: string,
    url?: string
}

export interface IPostECommerceModel<T = string | ObjectId, P = string[] | ObjectId[]> {
    typeId: ProductTypeId
    images: string[]
    pricing?: IPostECommercePricingModel
    inventory?: IPostECommerceInventoryModel
    shipping?: IPostECommerceShippingModel
    attributes?: IPostECommerceAttributeModel<T, P>[]
    variations?: IPostECommerceVariationModel<T>[]
    variationDefaults?: IPostECommerceVariationSelectedModel<T>[]
}

export interface IPostECommercePricingModel {
    taxRate: number
    taxExcluded: number
    taxIncluded: number
    compared: number
    shipping: number
}

export interface IPostECommerceInventoryModel {
    sku: string
    isManageStock: boolean
    quantity: number
}

export interface IPostECommerceShippingModel {
    width: string
    height: string
    depth: string
    weight: string
}

export interface IPostECommerceAttributeModel<T = string | ObjectId, P = string[] | ObjectId[]> {
    _id?: string | ObjectId
    attributeId: T
    variations: P
    typeId: AttributeTypeId
}

export interface IPostECommerceVariationModel<T = string | ObjectId> {
    _id?: string | ObjectId
    rank: number
    selectedVariations: IPostECommerceVariationSelectedModel<T>[]
    images: string[]
    contents?: IPostECommerceVariationContentModel[]
    inventory: IPostECommerceInventoryModel
    shipping: IPostECommerceShippingModel
    pricing: IPostECommercePricingModel
}

export interface IPostECommerceVariationSelectedModel<T = string | ObjectId> {
    _id?: string | ObjectId
    attributeId: T
    variationId: T
}

export interface IPostECommerceVariationContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    image?: string
    content?: string,
    shortContent?: string,
}