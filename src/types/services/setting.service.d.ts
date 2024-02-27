import {
    ISettingContactFormModel,
    ISettingModel, ISettingECommerceModel,
    ISettingSeoContentModel, ISettingSocialMediaModel,
    ISettingStaticContentContentModel,
    ISettingStaticContentModel
} from "../models/setting.model";
import {SettingProjectionKeys} from "../../constants/settingProjections";

export type ISettingGetResultService = {
    seoContents?: ISettingSeoContentModel | ISettingSeoContentModel[]
    staticContents?: (Omit<ISettingStaticContentModel, "contents"> & { contents?: ISettingStaticContentContentModel | ISettingStaticContentContentModel[] })[]
} & Omit<ISettingModel, "seoContents" | "staticContents">

export type ISettingGetParamService = {
    langId?: string
    projection?: SettingProjectionKeys
}

export type ISettingAddParamService = {
    seoContents?: ISettingSeoContentModel
    staticContents?: (Omit<ISettingStaticContentModel, "contents"> & { contents: ISettingStaticContentContentModel})[]
} & Omit<ISettingModel, "_id" | "seoContents" | "staticContents">

export type ISettingUpdateGeneralParamService = {

} & Omit<ISettingAddParamService, "seoContents"|"contactForms"|"staticContents"|"socialMedia">

export type ISettingUpdateSEOParamService = {
    seoContents?: ISettingSeoContentModel
}

export type ISettingUpdateECommerceParamService = {
    eCommerce: ISettingECommerceModel
}

export type ISettingUpdateContactFormParamService = {
    contactForms: ISettingContactFormModel[]
}

export type ISettingUpdateSocialMediaParamService = {
    socialMedia: ISettingSocialMediaModel[]
}

export type ISettingUpdateStaticContentParamService = {
    staticContents?: (Omit<ISettingStaticContentModel, "contents"> & { contents: ISettingStaticContentContentModel})[]
}