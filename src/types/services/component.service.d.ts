import {IUserPopulateService} from "./user.service";
import {IComponentModel, IComponentTypeContentModel, IComponentTypeModel} from "../models/component.model";

export type IComponentGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    types: (Omit<IComponentTypeModel, "contents"> & {
        contents?: IComponentTypeContentModel | IComponentTypeContentModel[]
    })[]
} & Omit<IComponentModel, "types"|"authorId"|"lastAuthorId">

export interface IComponentGetOneParamService {
    _id: string
    langId?: string,
    elementId?: string
}

export interface IComponentGetManyParamService {
    _id?: string[]
    langId?: string,
    elementId?: string[]
}

export type IComponentAddParamService = {
    types?: (Omit<IComponentTypeModel, "contents"> & {
        contents: IComponentTypeContentModel
    })[]
} & Omit<IComponentModel, "_id"|"types"|"">

export type IComponentUpdateOneParamService = {
    _id: string
} & Omit<IComponentAddParamService, "authorId">

export interface IComponentDeleteManyParamService {
    _id: string[]
}