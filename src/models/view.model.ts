import * as mongoose from "mongoose";
import languageModel from "./language.model";
import {ViewDocument} from "../types/models/view.model";

const schema = new mongoose.Schema<ViewDocument>(
    {
        url: {type: String, default: ""},
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        ip: {type: String, default: "", required: true},
        country: {type: String, default: ""},
        city: {type: String, default: ""},
        region: {type: String, default: ""}
    },
    {timestamps: true}
).index({langId: 1})

export default mongoose.model<ViewDocument, mongoose.Model<ViewDocument>>("views", schema)