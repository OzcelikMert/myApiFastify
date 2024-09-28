import { ObjectId } from "mongoose"
import {CurrencyId} from "@constants/currencyTypes";

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
    socialMedia: ISettingSocialMediaModel[]
    eCommerce?: ISettingECommerceModel
    paths: ISettingPathModel[]
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
    key: string
    title: string
    url: string
}

export interface ISettingContactFormModel {
    _id?: string | ObjectId
    name: string
    key: string
    title: string
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

export interface ISettingPathModel {
    _id?: string | ObjectId
    title: string
    key: string
    path: string
    contents: ISettingPathContentModel[]
}

export interface ISettingPathContentModel {
    _id?: string | ObjectId
    langId: string | ObjectId
    asPath: string,
}