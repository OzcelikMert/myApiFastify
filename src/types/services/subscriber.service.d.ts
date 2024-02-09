import {ISubscriberModel} from "../models/subscriber.model";

export type ISubscriberGetResultService = {} & ISubscriberModel

export interface ISubscriberGetOneParamService {
    _id?: string
    email?: string
}

export interface ISubscriberGetManyParamService {
    _id?: string[]
    email?: string
}

export type ISubscriberAddService = {} & Omit<ISubscriberModel, "_id">

export interface ISubscriberDeleteOneParamService {
    email?: string
    _id?: string
}

export interface ISubscriberDeleteManyParamService {
    _id: string[]
}