import { ObjectId } from "mongoose"
import {CurrencyId} from "../../constants/currencyTypes";

export interface ISettingModel {
    _id: string | ObjectId
    defaultLangId: string | ObjectId
    icon?: string
    logo?: string
    logoTwo?: string
    head?: string
    script?: string
    seoContents: ISettingSeoContentModel[],
    contact?: ISettingContactModel
    contactForms: ISettingContactFormModel[],
    staticLanguages: ISettingStaticLanguageModel[]
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

export interface ISettingStaticLanguageModel {
    _id?: string | ObjectId
    langKey: string,
    title: string
    contents: ISettingStaticLanguageContentModel[]
}

export interface ISettingStaticLanguageContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    content?: string,
}