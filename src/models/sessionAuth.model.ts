import * as mongoose from "mongoose";
import userModel from "./user.model";
import {UserRoleId} from "../constants/userRoles";
import {SessionAuthDocument, SessionAuthUserDocument} from "../types/models/sessionAuth.model";

const schemaUser = new mongoose.Schema<SessionAuthUserDocument>(
    {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: userModel},
            roleId: {type: Number, required: true, enum: UserRoleId},
            ip: {type: String, default: "", required: true},
            email: {type: String, required: true},
            token: {type: String, default: "", required: true},
            permissions: {type: [Number], default: []},
            refreshedAt: {type: String, default: ""},
    },
    {timestamps: true}
)

const schema = new mongoose.Schema<SessionAuthDocument>(
    {
            user: {type: schemaUser, required: true}
    },
    {timestamps: true}
)

export default mongoose.model<SessionAuthDocument, mongoose.Model<SessionAuthDocument>>("sessionAuth", schema);