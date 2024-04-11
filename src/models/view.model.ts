import * as mongoose from "mongoose";
import {languageModel} from "@models/language.model";
import {IViewModel} from "types/models/view.model";

const schema = new mongoose.Schema<IViewModel>(
    {
        url: {type: String, default: ""},
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        ip: {type: String, default: "", required: true},
        country: {type: String, default: ""},
        city: {type: String, default: ""},
        region: {type: String, default: ""}
    },
    {timestamps: true}
).index({langId: 1, ip: 1, city: 1, country: 1, region: 1})

export const viewModel = mongoose.model<IViewModel, mongoose.Model<IViewModel>>("views", schema)