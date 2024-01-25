import * as mongoose from "mongoose";
import userModel from "../models/user.model";
import {
    UserDeleteOneParamDocument,
    UserAddParamDocument,
    UserGetOneParamDocument, UserGetResultDocument,
    UserUpdateOneParamDocument,
    UserGetManyParamDocument
} from "../types/services/user.service";
import {StatusId} from "../constants/status";
import userUtil from "../utils/user.util";
import MongoDBHelpers from "../library/mongodb/helpers";
import {Config} from "../config";
import Variable from "../library/variable";
import userObjectIdKeys from "../constants/objectIdKeys/user.objectIdKeys";
import {UserDocument} from "../types/models/user.model";

export default {
    async getOne(params: UserGetOneParamDocument) {
        params = MongoDBHelpers.convertObjectIdInData(params, [...userObjectIdKeys, "ignoreUserId"]);

        let filters: mongoose.FilterQuery<UserDocument> = {
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
                password: userUtil.encodePassword(params.password)
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

        let doc = (await query.lean<UserGetResultDocument>().exec());

        if(doc){
            delete doc.password;
            doc.isOnline = Config.onlineUsers.indexOfKey("_id", doc._id.toString()) > -1;
        }

        return doc;
    },
    async getMany(params: UserGetManyParamDocument) {
        params = MongoDBHelpers.convertObjectIdInData(params, [...userObjectIdKeys, "ignoreUserId"]);

        let filters: mongoose.FilterQuery<UserDocument> = {
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

        return (await query.lean<UserGetResultDocument[]>().exec()).map((user) => {
            delete user.password;
            user.isOnline = Config.onlineUsers.indexOfKey("_id", user._id?.toString()) > -1;
            return user;
        });
    },
    async add(params: UserAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, userObjectIdKeys);

        return await userModel.create({
            ...params,
            password: userUtil.encodePassword(params.password)
        })
    },
    async updateOne(params: UserUpdateOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, userObjectIdKeys);

        let filters: mongoose.FilterQuery<UserDocument> = {}

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
                doc.password = userUtil.encodePassword(params.password)
                delete params.password;
            }
            doc = Object.assign(doc, params);
            await doc.save();
        }

        return params;
    },
    async deleteOne(params: UserDeleteOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, userObjectIdKeys);

        let filters: mongoose.FilterQuery<UserDocument> = {}

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
};