import * as mongoose from "mongoose";
import {IComponentElementContentModel, IComponentElementModel, IComponentModel} from "../types/models/component.model";
import {userModel} from "./user.model";
import {ElementTypeId} from "../constants/elementTypes";
import {languageModel} from "./language.model";
import {ComponentTypeId} from "../constants/componentTypes";

const schemaElementContent = new mongoose.Schema<IComponentElementContentModel>(
    {
            langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
            content: {type: String, default: ""},
            url: {type: String}
    }
).index({langId: 1});

const schemaElement = new mongoose.Schema<IComponentElementModel>(
    {
            typeId: {type: Number, required: true, enum: ElementTypeId},
            title: {type: String, required: true},
            elementId: {type: String, required: true},
            rank: {type: Number, default: 0},
            contents: {type: [schemaElementContent], default: []}
    }
);

const schema = new mongoose.Schema<IComponentModel>(
    {
            authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
            lastAuthorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
            title: {type: String, required: true},
            elementId: {type: String, required: true},
            elements: {type: [schemaElement], default: []},
            typeId: {type: Number, required: true, enum: ComponentTypeId},
    },
    {timestamps: true}
).index({authorId: 1, elementId: 1, typeId: 1});

export const componentModel = mongoose.model<IComponentModel, mongoose.Model<IComponentModel>>("components", schema)