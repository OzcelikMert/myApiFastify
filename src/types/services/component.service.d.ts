import {IUserPopulateService} from "../services/user.service";
import {IComponentElementModel, IComponentModel, IComponentElementContentModel} from "../models/component.model";
import {ComponentTypeId} from "@constants/componentTypes";

export interface IComponentAlternateService {
    langId: string
}

export type IComponentGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    elements: (Omit<IComponentElementModel, "contents"> & {
        contents?: IComponentElementContentModel | IComponentElementContentModel[]
        alternates?: IComponentAlternateService[]
    })[]
} & Omit<IComponentModel, "elements"|"authorId"|"lastAuthorId">

export interface IComponentGetParamService {
    _id?: string
    key?: string
    langId?: string
}

export interface IComponentGetManyParamService {
    _id?: string[]
    key?: string[]
    langId?: string,
    typeId?: ComponentTypeId
    withContent?: boolean
}

export type IComponentAddParamService = {
    elements?: (Omit<IComponentElementModel, "contents"> & {
        contents: IComponentElementContentModel
    })[]
} & Omit<IComponentModel, "_id"|"elements">

export type IComponentUpdateParamService = {
    _id: string
} & Omit<IComponentAddParamService, "authorId">

export interface IComponentDeleteManyParamService {
    _id: string[]
}