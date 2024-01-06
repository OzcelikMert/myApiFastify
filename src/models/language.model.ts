import * as mongoose from "mongoose";
import {LanguageDocument} from "../types/models/language.model";
import {StatusId} from "../constants/status";

const schema = new mongoose.Schema<LanguageDocument>(
    {
        title: {type: String, required: true},
        image: {type: String, required: true},
        shortKey: {type: String, required: true},
        locale: {type: String, required: true},
        statusId: {type: Number, required: true, enum: StatusId},
        rank: {type: Number, default: 0}
    },
    {timestamps: true}
)

export default mongoose.model<LanguageDocument, mongoose.Model<LanguageDocument>>("languages", schema)