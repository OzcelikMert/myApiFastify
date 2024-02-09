import {ILogModel} from "../models/log.model";

export type ILogAddParamService = {} & Omit<ILogModel, "_id">