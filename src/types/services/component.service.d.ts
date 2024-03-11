import {IUserPopulateService} from "./user.service";
import {IComponentElementModel, IComponentModel, IComponentElementContentModel} from "../models/component.model";

export type IComponentGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    elements: (Omit<IComponentElementModel, "contents"> & {
        contents?: IComponentElementContentModel | IComponentElementContentModel[]
    })[]
} & Omit<IComponentModel, "elements"|"authorId"|"lastAuthorId">

export interface IComponentGetParamService {
    _id?: string
    elementId?: string
    langId?: string
}

export interface IComponentGetManyParamService {
    _id?: string[]
    elementId?: string[]
    langId?: string,
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