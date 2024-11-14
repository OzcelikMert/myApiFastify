import { ILogModel } from 'types/models/log.model';

export type ILogAddParamService = {} & Omit<ILogModel, '_id'>;
