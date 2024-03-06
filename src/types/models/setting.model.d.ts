import { ObjectId } from "mongoose"
import {CurrencyId} from "../../constants/currencyTypes";
import {StaticContentTypeId} from "../../constants/staticContentTypes";

export interface ISettingModel {
    _id: string | ObjectId
    icon?: string
    logo?: string
    logoTwo?: string
    head?: string
    script?: string
    seoContents: ISettingSeoContentModel[],
    contact?: ISettingContactModel
    contactForms: ISettingContactFormModel[],
    staticContents: ISettingStaticContentModel[]
    socialMedia: ISettingSocialMediaModel[]
    eCommerce?: ISettingECommerceModel
}

export interface ISettingECommerceModel {
    currencyId: CurrencyId
}

export interface ISettingContactModel {
    email?: string,
    phone?: string,
    address?: string,
    addressMap?: string
}

export interface ISettingSocialMediaModel {
    _id?: string | ObjectId
    elementId: string
    title: string
    url: string
}

export interface ISettingContactFormModel {
    _id?: string | ObjectId
    name: string
    key: string
    outGoingEmail: string
    email: string
    password?: string
    outGoingServer: string
    inComingServer: string
    port: number
}

export interface ISettingSeoContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    title?: string,
    content?: string,
    tags?: string[]
}

export interface ISettingStaticContentModel {
    _id?: string | ObjectId
    typeId: StaticContentTypeId,
    label: string
    elementId: string
    rank: number
    contents: ISettingStaticContentContentModel[]
}

export interface ISettingStaticContentContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    content?: string,
    url?: string
}