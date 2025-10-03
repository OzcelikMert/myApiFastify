import * as mongoose from 'mongoose';
import { IPostModel } from 'types/models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';

export const createMockPost = (overrides: Partial<IPostModel> = {}): IPostModel => {
    const objectId = new mongoose.Types.ObjectId();
    return {
        _id: objectId.toString(),
        typeId: PostTypeId.Blog,
        statusId: StatusId.Active,
        authorId: new mongoose.Types.ObjectId().toString(),
        lastAuthorId: new mongoose.Types.ObjectId().toString(),
        rank: 0,
        contents: [],
        ...overrides,
    };
};