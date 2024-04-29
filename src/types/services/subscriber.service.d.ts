import {ISubscriberModel} from "types/models/subscriber.model";

export interface ISubscriberGetParamService {
    _id?: string
    email?: string
}

export interface ISubscriberGetManyParamService {
    _id?: string[]
    email?: string[]
}

export type ISubscriberAddParamService = {} & Omit<ISubscriberModel, "_id">

export interface ISubscriberDeleteParamService {
    email?: string
    _id?: string
}

export interface ISubscriberDeleteManyParamService {
    _id: string[]
}