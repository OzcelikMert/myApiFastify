import * as mongoose from 'mongoose';
import { userModel } from '@models/user.model';
import { IGalleryModel } from 'types/models/gallery.model';
import { GalleryTypeId } from '@constants/galleryTypeId';

const schema = new mongoose.Schema<IGalleryModel>(
  {
    name: { type: String, required: true },
    oldName: { type: String, required: true },
    typeId: { type: Number, enum: GalleryTypeId, default: GalleryTypeId.Image },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
    sizeKB: { type: Number, required: true },
    sizeMB: { type: Number, required: true },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

schema.virtual('author', {
  ref: 'users',
  localField: 'authorId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

export const galleryModel = mongoose.model<
  IGalleryModel,
  mongoose.Model<IGalleryModel>
>('gallery', schema);
