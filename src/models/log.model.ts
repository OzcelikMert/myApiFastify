import * as mongoose from 'mongoose';
import { ILogModel } from 'types/models/log.model';
import { userModel } from '@models/user.model';

const schema = new mongoose.Schema<ILogModel>(
  {
    ip: { type: String, default: '', required: true },
    url: { type: String, default: '', required: true },
    method: { type: String, default: '', required: true },
    message: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
    params: { type: String, default: '' },
    body: { type: String, default: '' },
    query: { type: String, default: '' },
  },
  { timestamps: true }
);

export const logModel = mongoose.model<ILogModel, mongoose.Model<ILogModel>>(
  'logs',
  schema
);
