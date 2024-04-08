import {IUserPopulateService} from "types/services/user.service";
import {INavigationContentModel, INavigationModel} from "types/models/navigation.model";
import {StatusId} from "@constants/status";

export interface INavigationPopulateService {
    _id:  string
    contents: {
        langId: string
        title: string,
        url: string,
    }
}

export interface INavigationAlternateService {
    langId: string
}

export type INavigationGetResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    mainId?: INavigationPopulateService,
    contents?: INavigationContentModel | INavigationContentModel[]
    alternates?: INavigationAlternateService[]
} & Omit<INavigationModel, "contents">

export interface INavigationGetParamService {
    _id?: string
    langId?: string
    statusId?: StatusId
}

export interface INavigationGetManyParamService {
    _id?: string[]
    langId?: string
    statusId?: StatusId
    isPrimary?: boolean
    isSecondary?: boolean
}

export type INavigationAddParamService = {
    contents?: Omit<INavigationContentModel, "_id">
    isPrimary?: boolean
    isSecondary?: boolean
} & Omit<INavigationModel, "_id"|"contents"|"isPrimary"|"isSecondary">

export type INavigationUpdateParamService = {
    _id: string
} & Omit<INavigationAddParamService, "authorId">

export type INavigationUpdateRankParamService = {
    _id: string
    rank: number,
    lastAuthorId: string
}

export type INavigationUpdateStatusManyParamService = {
    _id: string[],
    statusId: StatusId,
    lastAuthorId: string
}

export interface INavigationDeleteManyParamService {
    _id: string[]
}