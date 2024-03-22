import * as mongoose from "mongoose";
import {userModel} from "./user.model";
import {StatusId} from "../constants/status";
import {languageModel} from "./language.model";
import {INavigationContentModel, INavigationModel} from "../types/models/navigation.model";

const schemaContent = new mongoose.Schema<INavigationContentModel>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        title: {type: String, default: ""},
        url: {type: String, default: ""},
    }
).index({langId: 1});

const schema = new mongoose.Schema<INavigationModel>(
    {
        statusId: {type: Number, required: true, enum: StatusId},
        mainId: {type: mongoose.Schema.Types.ObjectId, ref: "navigations"},
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        lastAuthorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        rank: {type: Number, default: 0},
        isPrimary: {type: Boolean, default: true},
        isSecondary: {type: Boolean, default: false},
        contents: {type: [schemaContent], default: []},
    },
    {timestamps: true}
).index({statusId: 1, authorId: 1});

export const navigationModel = mongoose.model<INavigationModel, mongoose.Model<INavigationModel>>("navigations", schema)