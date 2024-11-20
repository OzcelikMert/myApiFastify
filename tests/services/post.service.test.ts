import { jest, describe, expect, beforeAll, afterAll, it } from '@jest/globals';
import { PostService } from '@services/post.service';
import { postModel } from '@models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { IPostModel } from 'types/models/post.model';
import { StatusId } from '@constants/status';

jest.mock('@services/post.service');
jest.mock('@models/post.model');

describe('PostService', () => {
  it('should return post by id', async () => {
    const mockPost: IPostModel = {
      _id: '123',
      authorId: '123',
      lastAuthorId: '123',
      rank: 1,
      statusId: StatusId.Active,
      typeId: PostTypeId.Blog,
      contents: [{ _id: '123', langId: '123', title: 'test' }],
    };

    (
      postModel.findById as jest.Mock<typeof postModel.findById>
    ).mockResolvedValue(mockPost);

    const post = PostService.get({ _id: '123', typeId: PostTypeId.Blog });
    expect(post).toEqual(mockPost);
    expect(postModel.findById).toHaveBeenCalledWith('123');
  });
});
