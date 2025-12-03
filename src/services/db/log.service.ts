import { VariableLibrary } from '@library/variable';
import { ILogAddParamService } from 'types/services/db/log.service';
import { logModel } from '@models/log.model';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { logObjectIdKeys } from '@constants/objectIdKeys/log.objectIdKeys';

const add = async (params: ILogAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, logObjectIdKeys);

  return (
    await logModel.create({
      ...params,
      ...(params.body ? { body: JSON.stringify(params.body) } : {}),
      ...(params.query ? { query: JSON.stringify(params.query) } : {}),
      ...(params.params ? { params: JSON.stringify(params.params) } : {}),
      ...(params.userId ? { userId: params.userId } : {}),
    })
  ).toObject();
};

export const LogService = {
  add: add,
};
