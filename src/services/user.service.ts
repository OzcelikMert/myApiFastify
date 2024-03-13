import * as mongoose from "mongoose";
import {userModel} from "../models/user.model";
import {
    IUserDeleteParamService,
    IUserAddParamService,
    IUserGetParamService, IUserGetResultService,
    IUserUpdateParamService,
    IUserGetManyParamService
} from "../types/services/user.service";
import {StatusId} from "../constants/status";
import {UserUtil} from "../utils/user.util";
import MongoDBHelpers from "../library/mongodb/helpers";
import {Config} from "../config";
import Variable from "../library/variable";
import {userObjectIdKeys} from "../constants/objectIdKeys/user.objectIdKeys";
import {IUserModel} from "../types/models/user.model";
import {PermissionUtil} from "../utils/permission.util";

const createURL = async (_id: string | null, name: string) => {
    let urlAlreadyCount = 2;
    let url = name.convertSEOUrl();

    let oldUrl = url;
    while ((await get({
        ignoreUserId: _id ? [_id] : undefined,
        url: url
    }))) {
        url = `${oldUrl}-${urlAlreadyCount}`;
        urlAlreadyCount++;
    }

    return url;
}

const get = async (params: IUserGetParamService, withPassword: boolean = false) => {
    params = MongoDBHelpers.convertToObjectIdData(params, [...userObjectIdKeys, "ignoreUserId"]);

    let filters: mongoose.FilterQuery<IUserModel> = {
        statusId: { $ne: StatusId.Deleted},
    }

    if(params.email) {
        filters = {
            ...filters,
            email: params.email
        }
    }
    if(params.password) {
        filters = {
            ...filters,
            password: UserUtil.encodePassword(params.password)
        }
    }
    if(params._id) {
        filters = {
            ...filters,
            _id: params._id
        }
    }
    if(params.roleId) {
        filters = {
            ...filters,
            roleId: params.roleId
        }
    }
    if(params.url) {
        filters = {
            ...filters,
            url: params.url
        }
    }
    if(params.statusId){
        filters = {
            ...filters,
            statusId: params.statusId
        }
    }
    if(params.ignoreUserId){
        filters = {
            ...filters,
            _id: { $nin: params.ignoreUserId }
        }
    }

    let query = userModel.findOne(filters, {});

    query.sort({createdAt: -1});

    let doc = (await query.lean<IUserGetResultService>().exec());

    if(doc){
        if(!withPassword){
            delete doc.password;
        }
        doc.isOnline = Config.onlineUsers.indexOfKey("_id", doc._id.toString()) > -1;
    }

    return doc;
}

const getMany = async (params: IUserGetManyParamService) => {
    params = MongoDBHelpers.convertToObjectIdData(params, [...userObjectIdKeys, "ignoreUserId"]);

    let filters: mongoose.FilterQuery<IUserModel> = {
        statusId: { $ne: StatusId.Deleted},
    }

    if (params.email) {
        filters = {
            ...filters,
            email: {$regex: new RegExp(params.email, "i")}
        }
    }
    if (params._id) {
        filters = {
            ...filters,
            _id: {$in: params._id}
        }
    }
    if(params.statusId){
        filters = {
            ...filters,
            statusId: params.statusId
        }
    }
    if(params.roleId){
        filters = {
            ...filters,
            roleId: params.roleId
        }
    }
    if(params.ignoreUserId){
        filters = {
            ...filters,
            _id: { $nin: params.ignoreUserId }
        }
    }

    let query = userModel.find(filters, {});

    if (params.page) query.skip((params.count ?? 10) * (params.page > 0 ? params.page - 1 : 0));
    if (params.count) query.limit(params.count);

    query.sort({createdAt: -1});

    return (await query.lean<IUserGetResultService[]>().exec()).map((user) => {
        delete user.password;
        user.isOnline = Config.onlineUsers.indexOfKey("_id", user._id?.toString()) > -1;
        return user;
    });
}

const add = async (params: IUserAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

    params.url = await createURL(null, params.name);

    return (await userModel.create({
        ...params,
        permissions: PermissionUtil.filterPermissionId(params.roleId, params.permissions),
        password: UserUtil.encodePassword(params.password)
    })).toObject()
}

const update = async (params: IUserUpdateParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

    let filters: mongoose.FilterQuery<IUserModel> = {}

    if (Variable.isEmpty(params.password)) {
        delete params.password;
    }

    if (params._id) {
        filters = {
            _id: params._id
        }
    }

    let doc = (await userModel.findOne(filters).exec());

    if(doc){
        if(params.password) {
            doc.password = UserUtil.encodePassword(params.password)
            delete params.password;
        }

        if(params.name && doc.name != params.name){
            params.url = await createURL(doc._id.toString(), params.name);
        }

        if(params.roleId && params.permissions){
            params.permissions = PermissionUtil.filterPermissionId(params.roleId, params.permissions);
        }

        doc = Object.assign(doc, params);
        await doc.save();
    }

    return params;
}

const delete_ = async (params: IUserDeleteParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, userObjectIdKeys);

    let filters: mongoose.FilterQuery<IUserModel> = {}

    if (params._id) {
        filters = {
            _id: params._id
        }
    }

    let doc = (await userModel.findOne(filters).exec());

    if(doc){
        doc.statusId = StatusId.Deleted;
        await doc.save();
    }

    return {
        _id: doc?._id
    };
}

export const UserService = {
    get: get,
    getMany: getMany,
    add: add,
    update: update,
    delete: delete_
};