import * as mongoose from "mongoose";
import {userModel} from "./user.model";
import {IGalleryModel} from "../types/models/gallery.model";
import {GalleryTypeId} from "../constants/galleryTypeId";

const schema = new mongoose.Schema<IGalleryModel>(
    {
        name: {type: String, default: ""},
        oldName: {type: String, default: ""},
        typeId: {type: Number, enum: GalleryTypeId, default: GalleryTypeId.Image},
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel},
    },
    {timestamps: true}
)

export const galleryModel = mongoose.model<IGalleryModel, mongoose.Model<IGalleryModel>>("gallery", schema);