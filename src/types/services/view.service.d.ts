import {IViewModel} from "../models/view.model";

export type IViewGetResultService = {} & IViewModel

export interface IViewGetParamService {
    ip?: string
    langId?: string
    url?: string
    country?: string
    city?: string
    region?: string
    dateStart?: Date
    dateEnd?: Date
}

export type IViewGetTotalResultService = {
    total: number
    _id: string
}

export interface IViewAddParamService {
    url: string,
    langId: string
    ip: string,
    country?: string,
    city?: string,
    region?: string
}

export interface IViewDeleteManyParamService {
    dateEnd: Date
}