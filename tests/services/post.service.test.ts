import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import * as mongoose from 'mongoose';
import { PostService } from '@services/post.service';
import { postModel } from '@models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { IPostModel } from 'types/models/post.model';
import { IUserModel } from 'types/models/user.model';
import { IPostAddParamService, IPostUpdateParamService } from 'types/services/post.service';
import { createMockPost } from '../helpers/post.helper';
import { VariableLibrary } from '@library/variable';
import { Config } from '@configs/index';

// Mock all dependencies locally
jest.mock('@models/post.model');
jest.mock('@library/variable');
jest.mock('@configs/index', () => ({
    Config: {
        defaultLangId: new mongoose.Types.ObjectId().toString(),
    },
}));

describe('PostService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock the clearAllScriptTags to return the input as is
        (VariableLibrary.clearAllScriptTags as jest.Mock).mockImplementation(params => params);
    });

    describe('get', () => {
        it('should return a post by _id and typeId', async () => {
            // Arrange
            const mockPost = createMockPost({ typeId: PostTypeId.Blog });

            // Mock the Mongoose query chain: findOne().sort().lean().exec()
            const execMock = jest.fn<() => Promise<IPostModel | null>>().mockResolvedValue(mockPost);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const sortMock = jest.fn().mockReturnThis();
            (postModel.findOne as jest.Mock).mockReturnValue({
                sort: sortMock,
                lean: leanMock,
            });

            // Act
            const post = await PostService.get({ _id: mockPost._id.toString(), typeId: PostTypeId.Blog });

            // Assert
            // The service's 'get' method returns the doc with an empty contents array
            const expectedPost = { ...mockPost, contents: [] };
            expect(post).toEqual(expectedPost);

            // Verify that findOne was called with the correct query
            expect(postModel.findOne).toHaveBeenCalledWith({
                _id: new mongoose.Types.ObjectId(mockPost._id as string),
                typeId: PostTypeId.Blog,
            });
        });
    });

    describe('add', () => {
        it('should create a new post', async () => {
            // Arrange
            const newPostData = createMockPost();
            // For an 'add' operation, we should not have an _id.
            // Let's create a valid payload based on the type.
            const addPostData: IPostAddParamService = {
                typeId: newPostData.typeId,
                statusId: newPostData.statusId,
                authorId: newPostData.authorId,
                lastAuthorId: newPostData.lastAuthorId,
                contents: { // Providing a valid content object
                    langId: new mongoose.Types.ObjectId().toString(),
                    title: 'New Post Title',
                    url: 'new-post-title',
                },
            };

            // Mock create to return a full post object, including a new _id.
            (postModel.create as jest.Mock).mockImplementation((post) =>
                Promise.resolve({ toObject: () => Object.assign({}, post, { _id: new mongoose.Types.ObjectId() }) })
            );

            // Mock findOne for the createURL check to return null (no duplicates).
            const execMock = jest.fn<() => Promise<IPostModel | null>>().mockResolvedValue(null);
            (postModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValue({ exec: execMock }),
            });

            // Act
            const result = await PostService.add(addPostData);

            // Assert
            expect(result._id).toBeDefined();
            expect(result.typeId).toBe(addPostData.typeId);
            // Check that create was called with an object that has the correct URL nested in its contents
            expect(postModel.create).toHaveBeenCalledWith(expect.objectContaining({
                contents: expect.objectContaining({
                    url: 'new-post-title'
                })
            }));
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            // Arrange
            const postId = new mongoose.Types.ObjectId().toString();
            const langId = new mongoose.Types.ObjectId();
            const mockPostData = createMockPost();
            const mockPostInstance = {
                ...createMockPost({ _id: postId, contents: [{ langId: langId.toString(), title: 'Old Title' }] as any }),
                save: jest.fn<() => Promise<any>>(),
                toObject: () => mockPostInstance,
            };
            mockPostInstance.save.mockResolvedValue(mockPostInstance);

            const findOneMockForUpdate = { exec: jest.fn<() => Promise<any>>().mockResolvedValue(mockPostInstance) };
            const findOneMockForCreateUrl = {
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValue({ exec: jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(null) }),
            };

            (postModel.findOne as jest.Mock)
                .mockReturnValueOnce(findOneMockForUpdate)
                .mockReturnValue(findOneMockForCreateUrl);

            const updateData: IPostUpdateParamService = {
                _id: postId,
                typeId: mockPostData.typeId,
                statusId: mockPostData.statusId,
                lastAuthorId: mockPostData.lastAuthorId,
                contents: {
                    langId: langId.toString(),
                    title: 'New Title',
                },
            };

            // Act
            await PostService.update(updateData);

            // Assert
            expect(mockPostInstance.save).toHaveBeenCalled();
            expect(mockPostInstance.contents[0].title).toBe('New Title');
        });

        it('should return null if post to update is not found', async () => {
            // Arrange
            const postId = new mongoose.Types.ObjectId().toString();
            const mockPostData = createMockPost();
            const findOneMock = { exec: jest.fn<() => Promise<IPostModel | null>>().mockResolvedValue(null) };
            (postModel.findOne as jest.Mock).mockReturnValue(findOneMock);

            const updateData: IPostUpdateParamService = {
                _id: postId,
                typeId: mockPostData.typeId,
                statusId: mockPostData.statusId,
                lastAuthorId: mockPostData.lastAuthorId,
                contents: {
                    langId: new mongoose.Types.ObjectId().toString(),
                    title: 'New Title',
                },
            };

            // Act
            const result = await PostService.update(updateData);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('deleteMany', () => {
        it('should delete multiple posts', async () => {
            // Arrange
            const objectIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
            (postModel.deleteMany as jest.Mock).mockReturnValue({
                exec: jest.fn<() => Promise<{ deletedCount: number }>>().mockResolvedValue({ deletedCount: 2 }),
            });

            // Act
            const result = await PostService.deleteMany({ _id: objectIds.map(id => id.toString()), typeId: PostTypeId.Blog });

            // Assert
            expect(result).toBe(2);
            expect(postModel.deleteMany).toHaveBeenCalledWith({
                _id: { $in: objectIds },
                typeId: PostTypeId.Blog,
            });
        });
    });

    describe('getMany', () => {
        it('should return an array of posts', async () => {
            // Arrange
            const mockPosts = [createMockPost(), createMockPost()];
            const execMock = jest.fn<() => Promise<IPostModel[]>>().mockResolvedValue(mockPosts);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (postModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            const posts = await PostService.getMany({});

            // Assert
            expect(posts).toHaveLength(2);
            expect(postModel.find).toHaveBeenCalled();
            expect(queryMock.sort).toHaveBeenCalled();
            expect(queryMock.lean).toHaveBeenCalled();
        });
    });
});