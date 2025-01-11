import * as mongoose from 'mongoose';
import { userModel } from '@models/user.model';
import {
  IUserDeleteParamService,
  IUserAddParamService,
  IUserGetParamService,
  IUserGetDetailedResultService,
  IUserUpdateParamService,
  IUserGetManyParamService,
  IUserUpdateStatusManyParamService,
  IUserGetManyDetailedParamService,
  IUserGetDetailedParamService,
} from 'types/services/user.service';
import { StatusId } from '@constants/status';
import { UserUtil } from '@utils/user.util';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { Config } from '@configs/index';
import { VariableLibrary } from '@library/variable';
import { userObjectIdKeys } from '@constants/objectIdKeys/user.objectIdKeys';
import { IUserModel } from 'types/models/user.model';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';

const createURL = async (_id: string | null, name: string) => {
  let urlAlreadyCount = 2;
  let url = name.convertSEOUrl();

  const oldUrl = url;
  while (
    await get({
      ignoreUserId: _id ? [_id] : undefined,
      url: url,
    })
  ) {
    url = `${oldUrl}-${urlAlreadyCount}`;
    urlAlreadyCount++;
  }

  return url;
};

const get = async (params: IUserGetParamService) => {
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...userObjectIdKeys,
    'ignoreUserId',
  ]);

  let filters: mongoose.FilterQuery<IUserModel> = {
    statusId: { $ne: StatusId.Deleted },
  };

  if (params.email) {
    filters = {
      ...filters,
      email: params.email,
    };
  }
  if (params.password) {
    filters = {
      ...filters,
      password: UserUtil.encodePassword(params.password),
    };
  }
  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.roleId) {
    filters = {
      ...filters,
      roleId: params.roleId,
    };
  }
  if (params.url) {
    filters = {
      ...filters,
      url: params.url,
      roleId: { $ne: UserRoleId.SuperAdmin },
    };
  }
  if (params.statusId) {
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  }
  if (params.ignoreUserId) {
    filters = {
      ...filters,
      _id: { $nin: params.ignoreUserId },
    };
  }

  const query = userModel.findOne(filters, {});

  query.sort({ _id: 'desc' });

  const doc = await query.lean<IUserModel>().exec();

  if (doc) {
  }

  return doc;
};

const getMany = async (params: IUserGetManyParamService) => {
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...userObjectIdKeys,
    'ignoreUserId',
  ]);

  let filters: mongoose.FilterQuery<IUserModel> = {
    statusId: { $ne: StatusId.Deleted },
    roleId: { $ne: UserRoleId.SuperAdmin },
  };

  if (params.email) {
    filters = {
      ...filters,
      email: { $regex: new RegExp(params.email, 'i') },
    };
  }
  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.statusId) {
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  }
  if (params.ignoreUserId) {
    filters = {
      ...filters,
      _id: { $nin: params.ignoreUserId },
    };
  }
  if (params.permissions) {
    filters = {
      ...filters,
      permissions: { $in: params.permissions },
    };
  }
  if (params.banDateEnd) {
    filters = {
      ...filters,
      banDateEnd: { $lt: params.banDateEnd },
    };
  }

  const query = userModel.find(filters, {});

  query.sort({ _id: 'desc' });

  const docs = await query.lean<IUserModel[]>().exec();

  return docs.map((user) => {
    return user;
  });
};

const getDetailed = async (
  params: IUserGetDetailedParamService,
  isAuthenticated = false
) => {
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...userObjectIdKeys,
    'ignoreUserId',
  ]);

  let filters: mongoose.FilterQuery<IUserModel> = {
    statusId: { $ne: StatusId.Deleted },
  };

  if (params.email) {
    filters = {
      ...filters,
      email: params.email,
    };
  }
  if (params.password) {
    filters = {
      ...filters,
      password: UserUtil.encodePassword(params.password),
    };
  }
  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.roleId) {
    filters = {
      ...filters,
      roleId: params.roleId,
    };
  }
  if (params.url) {
    filters = {
      ...filters,
      url: params.url,
      roleId: { $ne: UserRoleId.SuperAdmin },
    };
  }
  if (params.statusId) {
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  }
  if (params.ignoreUserId) {
    filters = {
      ...filters,
      _id: { $nin: params.ignoreUserId },
    };
  }

  const query = userModel.findOne(filters, {});

  query.populate({
    path: ['authorId', 'lastAuthorId'].join(' '),
    select: '_id name url image',
    options: { omitUndefined: true },
  });

  query.sort({ _id: 'desc' });

  const doc = await query.lean<IUserGetDetailedResultService>().exec();

  if (doc) {
    delete doc.password;

    if (!isAuthenticated) {
      delete doc.phone;
      doc.email = "";
    }

    doc.isOnline =
      Config.onlineUsers.indexOfKey('_id', doc._id.toString()) > -1;
  }

  return doc;
};

const getManyDetailed = async (
  params: IUserGetManyDetailedParamService,
  isAuthenticated = false
) => {
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...userObjectIdKeys,
    'ignoreUserId',
  ]);

  let filters: mongoose.FilterQuery<IUserModel> = {
    statusId: { $ne: StatusId.Deleted },
    roleId: { $ne: UserRoleId.SuperAdmin },
  };

  if (params.email) {
    filters = {
      ...filters,
      email: { $regex: new RegExp(params.email, 'i') },
    };
  }
  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.statusId) {
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  }
  if (params.ignoreUserId) {
    filters = {
      ...filters,
      _id: { $nin: params.ignoreUserId },
    };
  }
  if (params.permissions) {
    filters = {
      ...filters,
      permissions: { $in: params.permissions },
    };
  }
  if (params.banDateEnd) {
    filters = {
      ...filters,
      banDateEnd: { $lt: params.banDateEnd },
    };
  }

  const query = userModel.find(filters, {});

  query.populate({
    path: ['authorId', 'lastAuthorId'].join(' '),
    select: '_id name url image',
    options: { omitUndefined: true },
  });

  if (params.page)
    query.skip((params.count ?? 10) * (params.page > 0 ? params.page - 1 : 0));
  if (params.count) query.limit(params.count);

  query.sort({ _id: 'desc' });

  const docs = await query.lean<IUserGetDetailedResultService[]>().exec();

  return docs.map((user) => {
    delete user.password;

    if (isAuthenticated) {
      delete user.phone;
      user.email = "";
    }

    user.isOnline =
      Config.onlineUsers.indexOfKey('_id', user._id?.toString()) > -1;
    return user;
  });
};

const add = async (params: IUserAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

  params.url = await createURL(null, params.name);

  return (
    await userModel.create({
      ...params,
      permissions: PermissionUtil.filterPermissionId(
        params.roleId,
        params.permissions
      ),
      password: UserUtil.encodePassword(params.password),
    })
  ).toObject();
};

const update = async (params: IUserUpdateParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

  let filters: mongoose.FilterQuery<IUserModel> = {};

  if (VariableLibrary.isEmpty(params.password)) {
    delete params.password;
  }

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }

  let doc = await userModel.findOne(filters).exec();

  if (doc) {
    if (params.password) {
      doc.password = UserUtil.encodePassword(params.password);
      delete params.password;
    }

    if (params.name && doc.name != params.name) {
      params.url = await createURL(doc._id.toString(), params.name);
    }

    if (params.roleId && params.permissions) {
      params.permissions = PermissionUtil.filterPermissionId(
        params.roleId,
        params.permissions
      );
    }

    doc = Object.assign(doc, params);
    await doc.save();
  }

  return doc ? doc.toObject() : null;
};

const updateStatusMany = async (params: IUserUpdateStatusManyParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

  let filters: mongoose.FilterQuery<IUserModel> = {};

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }

  const docs = await userModel.find(filters).exec();

  return await Promise.all(
    docs.map(async (doc) => {
      doc.statusId = params.statusId;

      if (params.lastAuthorId) {
        doc.lastAuthorId = params.lastAuthorId;
      }

      await doc.save();

      return {
        _id: doc._id,
        statusId: doc.statusId,
        lastAuthorId: doc.lastAuthorId,
      };
    })
  );
};

const delete_ = async (params: IUserDeleteParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

  let filters: mongoose.FilterQuery<IUserModel> = {};

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }

  const doc = await userModel.findOne(filters).exec();

  if (doc) {
    doc.statusId = StatusId.Deleted;
    doc.lastAuthorId = params.lastAuthorId;
    await doc.save();
  }

  return {
    _id: doc?._id,
  };
};

export const UserService = {
  get: get,
  getMany: getMany,
  getDetailed: getDetailed,
  getManyDetailed: getManyDetailed,
  add: add,
  update: update,
  updateStatusMany: updateStatusMany,
  delete: delete_,
};
