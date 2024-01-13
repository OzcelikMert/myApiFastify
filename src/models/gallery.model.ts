import * as mongoose from "mongoose";
import userModel from "./user.model";
import {GalleryDocument} from "../types/models/gallery.model";

const schema = new mongoose.Schema<GalleryDocument>(
    {
            name: {type: String, default: ""},
            oldName: {type: String, default: ""},
            title: {type: String, default: ""},
            authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel},
    },
    {timestamps: true}
)

export default mongoose.model<GalleryDocument, mongoose.Model<GalleryDocument>>("gallery", schema);