import {IUserPopulateService} from "./user.service";
import {INavigationContentModel, INavigationModel} from "../models/navigation.model";
import {StatusId} from "../../constants/status";

export interface INavigationPopulateService {
    _id:  string
    contents: {
        langId: string
        title: string,
        url: string,
    }
}

export type INavigationGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    mainId?: INavigationPopulateService,
    contents?: INavigationContentModel | INavigationContentModel[]
} & Omit<INavigationModel, "contents">

export interface INavigationGetOneParamService {
    _id?: string
    langId?: string
    statusId?: StatusId
}

export interface INavigationGetManyParamService {
    _id?: string[]
    langId?: string
    statusId?: StatusId
    ignoreDefaultLanguage?: boolean
}

export type INavigationAddParamService = {
    contents?: Omit<INavigationContentModel, "_id">
} & Omit<INavigationModel, "_id"|"contents">

export type INavigationUpdateOneParamService = {
    _id: string
} & Omit<INavigationAddParamService, "authorId">

export type INavigationUpdateOneRankParamService = {
    _id: string
    rank: number,
    lastAuthorId: string
}

export type INavigationUpdateManyStatusIdParamService = {
    _id: string[],
    statusId: StatusId,
    lastAuthorId: string
}

export interface INavigationDeleteManyParamService {
    _id: string[]
}