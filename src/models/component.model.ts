import * as mongoose from 'mongoose';
import {
  IComponentElementContentModel,
  IComponentElementModel,
  IComponentModel,
} from 'types/models/component.model';
import { ElementTypeId } from '@constants/elementTypes';
import { ComponentTypeId } from '@constants/componentTypes';
import { languageModel } from '@models/language.model';
import { userModel } from '@models/user.model';

const schemaElementContent = new mongoose.Schema<IComponentElementContentModel>(
  {
    langId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: languageModel,
      required: true,
    },
    content: { type: String, default: '' },
    url: { type: String },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const schemaElement = new mongoose.Schema<IComponentElementModel>(
  {
    typeId: { type: Number, required: true, enum: ElementTypeId },
    title: { type: String, required: true },
    key: { type: String, required: true },
    rank: { type: Number, default: 0 },
    contents: { type: [schemaElementContent], default: [] },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema<IComponentModel>(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    lastAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    title: { type: String, required: true },
    key: { type: String, required: true },
    elements: { type: [schemaElement], default: [] },
    typeId: { type: Number, required: true, enum: ComponentTypeId },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
).index({ authorId: 1, typeId: 1 });

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

schemaElementContent.virtual('lang', {
  ref: 'languages',
  localField: 'langId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

export const componentModel = mongoose.model<
  IComponentModel,
  mongoose.Model<IComponentModel>
>('components', schema);
