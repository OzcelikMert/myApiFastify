import * as mongoose from 'mongoose';
import { ILanguageModel } from 'types/models/language.model';
import { StatusId } from '@constants/status';

const schema = new mongoose.Schema<ILanguageModel>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    shortKey: { type: String, required: true },
    locale: { type: String, required: true },
    statusId: { type: Number, required: true, enum: StatusId },
    rank: { type: Number, default: 0 },
    isDefault: { type: Boolean, required: true, default: false },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    lastAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
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

schema.virtual('lastAuthor', {
  ref: 'users',
  localField: 'lastAuthorId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

export const languageModel = mongoose.model<
  ILanguageModel,
  mongoose.Model<ILanguageModel>
>('languages', schema);
