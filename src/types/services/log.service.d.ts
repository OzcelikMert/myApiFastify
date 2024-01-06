import {LogDocument} from "../models/log.model";

export type LogAddParamDocument = {} & Omit<LogDocument, "_id">