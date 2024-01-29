import { ObjectId } from "mongoose"
import {PostTypeId} from "../../constants/postTypes";
import {PageTypeId} from "../../constants/pageTypes";
import {StatusId} from "../../constants/status";
import {AttributeTypeId} from "../../constants/attributeTypes";
import {ProductTypeId} from "../../constants/productTypes";

export interface PostDocument {
    _id?: string | ObjectId
    typeId?: PostTypeId,
    statusId: StatusId,
    pageTypeId?: PageTypeId,
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    dateStart: Date,
    rank: number,
    isFixed?: boolean,
    categories?: string[]
    tags?: string[]
    contents: PostContentDocument[]
    components?: string[] | ObjectId[]
    beforeAndAfter?: PostBeforeAndAfterDocument
    eCommerce?: PostECommerceDocument
    updatedAt?: string
    createdAt?: string
}

export interface PostContentDocument {
    _id?: string | ObjectId
    langId: string | ObjectId
    image?: string
    icon?: string
    title?: string,
    content?: string,
    shortContent?: string,
    url?: string,
    views?: number,
    buttons?: PostContentButtonDocument[]
}

export interface PostBeforeAndAfterDocument {
    imageBefore: string
    imageAfter: string
    images: string[]
}

export interface PostContentButtonDocument {
    _id?: string | ObjectId
    title: string,
    url?: string
}

export interface PostECommerceDocument<T = string | ObjectId, P = string[] | ObjectId[]> {
    typeId: ProductTypeId
    images: string[]
    pricing?: PostECommercePricingDocument
    inventory?: PostECommerceInventoryDocument
    shipping?: PostECommerceShippingDocument
    attributes?: PostECommerceAttributeDocument<T, P>[]
    variations?: PostECommerceVariationDocument<T>[]
    variationDefaults?: PostECommerceVariationSelectedDocument<T>[]
}

export interface PostECommercePricingDocument {
    taxRate: number
    taxExcluded: number
    taxIncluded: number
    compared: number
    shipping: number
}

export interface PostECommerceInventoryDocument {
    sku: string
    isManageStock: boolean
    quantity: number
}

export interface PostECommerceShippingDocument {
    width: string
    height: string
    depth: string
    weight: string
}

export interface PostECommerceAttributeDocument<T = string | ObjectId, P = string[] | ObjectId[]> {
    _id?: string | ObjectId
    attributeId: T
    variations: P
    typeId: AttributeTypeId
}

export interface PostECommerceVariationDocument<T = string | ObjectId> {
    _id?: string | ObjectId
    rank: number
    selectedVariations: PostECommerceVariationSelectedDocument<T>[]
    images: string[]
    contents?: PostECommerceVariationContentDocument[]
    inventory: PostECommerceInventoryDocument
    shipping: PostECommerceShippingDocument
    pricing: PostECommercePricingDocument
}

export interface PostECommerceVariationSelectedDocument<T = string | ObjectId> {
    _id?: string | ObjectId
    attributeId: T
    variationId: T
}

export interface PostECommerceVariationContentDocument {
    _id?: string | ObjectId
    langId: string | ObjectId
    image?: string
    content?: string,
    shortContent?: string,
}