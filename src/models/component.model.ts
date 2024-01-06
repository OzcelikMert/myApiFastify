import * as mongoose from "mongoose";
import {ComponentDocument, ComponentTypeContentDocument, ComponentTypeDocument} from "../types/models/component.model";
import languageModel from "./language.model";
import userModel from "./user.model";
import {ComponentInputTypeId} from "../constants/componentInputTypes";

const schemaTypeContent = new mongoose.Schema<ComponentTypeContentDocument>(
    {
            langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
            content: {type: String, default: ""},
            url: {type: String},
            comment: {type: String}
    }
).index({langId: 1});

const schemaType = new mongoose.Schema<ComponentTypeDocument>(
    {
            typeId: {type: Number, required: true, enum: ComponentInputTypeId},
            langKey: {type: String, required: true},
            elementId: {type: String, required: true},
            rank: {type: Number, default: 0},
            contents: {type: [schemaTypeContent], default: []}
    }
);

const schema = new mongoose.Schema<ComponentDocument>(
    {
            authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
            lastAuthorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
            langKey: {type: String, required: true},
            elementId: {type: String, required: true},
            types: {type: [schemaType], default: []}
    },
    {timestamps: true}
).index({authorId: 1});

export default mongoose.model<ComponentDocument, mongoose.Model<ComponentDocument>>("components", schema)