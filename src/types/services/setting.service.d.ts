import {
    ISettingContactFormModel,
    ISettingModel, ISettingECommerceModel,
    ISettingSeoContentModel, ISettingSocialMediaModel, ISettingPathModel, ISettingPathContentModel
} from "../models/setting.model";
import {SettingProjectionKeys} from "../../constants/settingProjections";

export type ISettingGetResultService = {
    seoContents?: ISettingSeoContentModel | ISettingSeoContentModel[]
} & Omit<ISettingModel, "seoContents">

export type ISettingGetParamService = {
    langId?: string
    projection?: SettingProjectionKeys
}

export type ISettingAddParamService = {
    seoContents?: ISettingSeoContentModel
} & Omit<ISettingModel, "_id" | "seoContents">

export type ISettingUpdateGeneralParamService = {

} & Omit<ISettingAddParamService, "seoContents"|"contactForms"|"socialMedia">

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

export type ISettingUpdatePathParamService = {
    paths: (Omit<ISettingPathModel, "contents"> & {contents: ISettingPathContentModel})[]
}