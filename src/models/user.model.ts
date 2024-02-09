import * as mongoose from "mongoose";
import {StatusId} from "../constants/status";
import {UserRoleId} from "../constants/userRoles";
import {IUserModel} from "../types/models/user.model";

const schema = new mongoose.Schema<IUserModel>(
    {
        roleId: {type: Number, required: true, enum: UserRoleId},
        statusId: {type: Number, required: true, enum: StatusId},
        image: {type: String, default: ""},
        name: {type: String, default: ""},
        url: {type: String, default: ""},
        comment: {type: String, default: ""},
        phone: {type: String, default: ""},
        email: {type: String, required: true},
        password: {type: String, required: true},
        permissions: {type: [Number], default: []},
        banDateEnd: {type: Date, default: new Date()},
        banComment: {type: String, default: ""},
        facebook: {type: String, default: ""},
        instagram: {type: String, default: ""},
        twitter: {type: String, default: ""}
    },
    {timestamps: true}
).index({roleId: 1, statusId: 1});

export default mongoose.model<IUserModel, mongoose.Model<IUserModel>>("users", schema)