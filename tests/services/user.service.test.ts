import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import * as mongoose from 'mongoose';
import { UserService } from '@services/db/user.service';
import { userModel } from '@models/user.model';
import { UserUtil } from '@utils/user.util';
import { PermissionUtil } from '@utils/permission.util';
import { StatusId } from '@constants/status';
import { UserRoleId } from '@constants/userRoles';
import { IUserModel } from 'types/models/user.model';
import { createMockUser } from '../helpers/user.helper';
import { IUserAddParamService, IUserUpdateParamService } from 'types/services/db/user.service';
import { ISessionAuth } from 'types/services/db/sessionAuth.service';
import { VariableLibrary } from '@library/variable';
import { Config } from '@configs/index';
import { PermissionId } from '@constants/permissions';

// Local mocks for all dependencies
jest.mock('@models/user.model');
jest.mock('@utils/user.util');
jest.mock('@utils/permission.util');
jest.mock('@library/variable');
jest.mock('@configs/index', () => ({
    Config: {
        onlineUsers: {
            indexOfKey: jest.fn().mockReturnValue(-1)
        },
    },
}));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock the clearAllScriptTags to return the input as is
        (VariableLibrary.clearAllScriptTags as jest.Mock).mockImplementation(params => params);
    });

    describe('get', () => {
        it('should return a user by _id', async () => {
            // Arrange
            const mockUser = createMockUser();
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const sortMock = jest.fn().mockReturnThis();
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: sortMock,
                lean: leanMock,
            });

            // Act
            const user = await UserService.get({ _id: mockUser._id.toString() });

            // Assert
            expect(user).toEqual(mockUser);
            expect(userModel.findOne).toHaveBeenCalledWith(
                {
                    _id: new mongoose.Types.ObjectId(mockUser._id as string),
                    statusId: { $ne: StatusId.Deleted },
                },
                {},
            );
        });

        it('should return a user by username and password', async () => {
            // Arrange
            const mockUser = createMockUser({ username: 'testuser', password: 'password' });
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            });
            (UserUtil.encodePassword as jest.Mock).mockReturnValue('encodedPassword');

            // Act
            const user = await UserService.get({ username: 'testuser', password: 'password' });

            // Assert
            expect(user).toEqual(mockUser);
            expect(userModel.findOne).toHaveBeenCalledWith(
                {
                    username: 'testuser',
                    password: 'encodedPassword',
                    statusId: { $ne: StatusId.Deleted },
                },
                {},
            );
        });

        it('should return a user by roleId', async () => {
            // Arrange
            const mockUser = createMockUser({ roleId: UserRoleId.Admin });
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            });

            // Act
            const user = await UserService.get({ roleId: UserRoleId.Admin });

            // Assert
            expect(user).toEqual(mockUser);
            expect(userModel.findOne).toHaveBeenCalledWith(
                {
                    roleId: UserRoleId.Admin,
                    statusId: { $ne: StatusId.Deleted },
                },
                {},
            );
        });

        it('should return a user by url', async () => {
            // Arrange
            const mockUser = createMockUser({ url: 'test-user' });
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            });

            // Act
            const user = await UserService.get({ url: 'test-user' });

            // Assert
            expect(user).toEqual(mockUser);
            expect(userModel.findOne).toHaveBeenCalledWith(
                {
                    url: 'test-user',
                    roleId: { $ne: UserRoleId.SuperAdmin },
                    statusId: { $ne: StatusId.Deleted },
                },
                {},
            );
        });

        it('should filter by statusId', async () => {
            // Arrange
            const mockUser = createMockUser({ statusId: StatusId.Pending });
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            });

            // Act
            const user = await UserService.get({ statusId: StatusId.Pending });

            // Assert
            expect(user).toEqual(mockUser);
            expect(userModel.findOne).toHaveBeenCalledWith(
                {
                    statusId: StatusId.Pending,
                },
                {},
            );
        });

        it('should ignore a user by id', async () => {
            // Arrange
            const userIdToIgnore = new mongoose.Types.ObjectId();
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(null);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            });

            // Act
            await UserService.get({ ignoreUserId: [userIdToIgnore.toString()] });

            // Assert
            expect(userModel.findOne).toHaveBeenCalledWith(
                {
                    _id: { $nin: [userIdToIgnore] },
                    statusId: { $ne: StatusId.Deleted },
                },
                {},
            );
        });
    });

    describe('add', () => {
        it('should create a new user', async () => {
            // Arrange
            const addUser: IUserAddParamService = {
                name: 'New User',
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123',
                roleId: UserRoleId.User,
                statusId: StatusId.Active,
                permissions: [],
            };
            const createdUser = { ...addUser, _id: new mongoose.Types.ObjectId().toString(), url: 'new-user' };

            // Mock implementation for create
            (userModel.create as jest.Mock).mockImplementation((user) => Promise.resolve({ toObject: () => (Object.assign({}, user, { _id: createdUser._id })) }));
            (UserUtil.encodePassword as jest.Mock).mockReturnValue('encodedPassword');
            (PermissionUtil.filterPermissionId as jest.Mock).mockReturnValue([]);

            // Mock findOne to return null (no existing user with the same name for createURL)
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(null);
            (userModel.findOne as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValue({ exec: execMock }),
            });

            // Act
            const result = await UserService.add(addUser);

            // Assert
            expect(result._id).toBeDefined();
            expect(result.name).toBe(addUser.name);
            expect(userModel.create).toHaveBeenCalledWith(expect.objectContaining({
                password: 'encodedPassword',
                url: 'new-user'
            }));
        });

        it('should create a user with an appended URL if the original exists', async () => {
            // Arrange
            const addUser: IUserAddParamService = {
                name: 'New User',
                username: 'newuser-collision',
                email: 'new-collision@example.com',
                password: 'password123',
                roleId: UserRoleId.User,
                statusId: StatusId.Active,
                permissions: [],
            };

            const execMockCollision = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(createMockUser());
            const execMockNoCollision = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(null);

            // Mock findOne for the createURL check
            (userModel.findOne as jest.Mock)
                // First call for 'new-user' finds a collision
                .mockReturnValueOnce({
                    sort: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockReturnValue({ exec: execMockCollision }),
                })
                // Second call for 'new-user-2' finds nothing
                .mockReturnValueOnce({
                    sort: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockReturnValue({ exec: execMockNoCollision }),
                });

            (userModel.create as jest.Mock).mockImplementation((user) => Promise.resolve({ toObject: () => user }));
            (UserUtil.encodePassword as jest.Mock).mockReturnValue('encodedPassword');
            (PermissionUtil.filterPermissionId as jest.Mock).mockReturnValue([]);

            // Act
            const result = await UserService.add(addUser);

            // Assert
            expect(result.url).toBe('new-user-2');
            expect(userModel.create).toHaveBeenCalledWith(expect.objectContaining({
                url: 'new-user-2'
            }));
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId().toString();
            const mockUserInstance = {
                ...createMockUser({ _id: userId, name: 'Old Name' }),
                save: jest.fn<() => Promise<any>>(),
                toObject: () => mockUserInstance, // Return the instance itself for assertions
            };
            mockUserInstance.save.mockResolvedValue(mockUserInstance);

            const findOneMockForUpdate = { exec: jest.fn<() => Promise<any>>().mockResolvedValue(mockUserInstance) };
            // Mock the internal call to createURL which uses findOne
            const findOneMockForCreateUrl = {
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValue({ exec: jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(null) }),
            };

            (userModel.findOne as jest.Mock)
                .mockReturnValueOnce(findOneMockForUpdate)
                .mockReturnValue(findOneMockForCreateUrl);

            const updateData: IUserUpdateParamService = {
                _id: userId,
                name: 'New Name',
                lastAuthorId: new mongoose.Types.ObjectId().toString(),
            };

            // Act
            await UserService.update(updateData);

            // Assert
            expect(mockUserInstance.save).toHaveBeenCalled();
            expect(mockUserInstance.name).toBe('New Name');
            expect(mockUserInstance).toHaveProperty('url', 'new-name');
        });

        it('should return null if user to update is not found', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId().toString();
            (userModel.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(null),
            });

            const updateData: IUserUpdateParamService = {
                _id: userId,
                name: 'New Name',
                lastAuthorId: new mongoose.Types.ObjectId().toString(),
            };

            // Act
            const result = await UserService.update(updateData);

            // Assert
            expect(result).toBeNull();
        });

        it('should update user password if provided', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId().toString();
            const mockUserInstance = {
                ...createMockUser({ _id: userId }),
                save: jest.fn<() => Promise<any>>().mockResolvedValue({}),
                toObject: () => mockUserInstance,
            };
            (userModel.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn<() => Promise<any>>().mockResolvedValue(mockUserInstance),
            });
            (UserUtil.encodePassword as jest.Mock).mockReturnValue('newEncodedPassword');

            const updateData: IUserUpdateParamService = {
                _id: userId,
                password: 'newPassword',
                lastAuthorId: new mongoose.Types.ObjectId().toString(),
            };

            // Act
            await UserService.update(updateData);

            // Assert
            expect(UserUtil.encodePassword).toHaveBeenCalledWith('newPassword');
            expect(mockUserInstance.password).toBe('newEncodedPassword');
            expect(mockUserInstance.save).toHaveBeenCalled();
        });

        it('should filter permissions when roleId is updated', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId().toString();
            const mockUserInstance = {
                ...createMockUser({ _id: userId, permissions: [] }),
                save: jest.fn<() => Promise<any>>().mockResolvedValue({}),
                toObject: () => mockUserInstance,
            };
            (userModel.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn<() => Promise<any>>().mockResolvedValue(mockUserInstance),
            });
            (PermissionUtil.filterPermissionId as jest.Mock).mockReturnValue([PermissionId.UserEdit]);

            const updateData: IUserUpdateParamService = {
                _id: userId,
                roleId: UserRoleId.Admin,
                permissions: [PermissionId.UserEdit, PermissionId.UserAdd],
                lastAuthorId: new mongoose.Types.ObjectId().toString(),
            };

            // Act
            await UserService.update(updateData);

            // Assert
            expect(PermissionUtil.filterPermissionId).toHaveBeenCalledWith(UserRoleId.Admin, [PermissionId.UserEdit, PermissionId.UserAdd]);
            expect(mockUserInstance.permissions).toEqual([PermissionId.UserEdit]);
            expect(mockUserInstance.save).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should mark a user as deleted', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId().toString();
            const mockUserInstance = {
                ...createMockUser({ _id: userId }),
                statusId: StatusId.Active,
                save: jest.fn<() => Promise<any>>().mockResolvedValue({}),
            };

            (userModel.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn<() => Promise<typeof mockUserInstance | null>>().mockResolvedValue(mockUserInstance),
            });

            // Act
            await UserService.delete({ _id: userId, lastAuthorId: new mongoose.Types.ObjectId().toString() });

            // Assert
            expect(mockUserInstance.statusId).toBe(StatusId.Deleted);
            expect(mockUserInstance.save).toHaveBeenCalled();
        });
    });

    describe('getMany', () => {
        it('should return an array of users', async () => {
            // Arrange
            const mockUsers = [createMockUser(), createMockUser()];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            const users = await UserService.getMany({});

            // Assert
            expect(users).toEqual(mockUsers);
            expect(userModel.find).toHaveBeenCalled();
            expect(queryMock.sort).toHaveBeenCalledWith({ _id: 'desc' });
        });

        it('should filter users by url', async () => {
            // Arrange
            const mockUsers = [createMockUser({ url: 'test-user-1' })];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            const users = await UserService.getMany({ url: 'test-user' });

            // Assert
            expect(users).toEqual(mockUsers);
            expect(userModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: { $regex: new RegExp('test-user', 'i') }
                }),
                {}
            );
        });

        it('should filter users by statusId', async () => {
            // Arrange
            const mockUsers = [createMockUser({ statusId: StatusId.Pending })];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            const users = await UserService.getMany({ statusId: StatusId.Pending });

            // Assert
            expect(users).toEqual(mockUsers);
            expect(userModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusId: StatusId.Pending
                }),
                {}
            );
        });

        it('should filter users by permissions', async () => {
            // Arrange
            const mockUsers = [createMockUser({ permissions: [1, 2] })];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            const users = await UserService.getMany({ permissions: [1] });

            // Assert
            expect(users).toEqual(mockUsers);
            expect(userModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    permissions: { $in: [1] }
                }),
                {}
            );
        });

        it('should filter users by banDateEnd', async () => {
            // Arrange
            const banEndDate = new Date();
            const mockUsers = [createMockUser({ banDateEnd: new Date(banEndDate.getTime() - 1000) })]; // Ban ended in the past
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            const users = await UserService.getMany({ banDateEnd: banEndDate });

            // Assert
            expect(users).toEqual(mockUsers);
            expect(userModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    banDateEnd: { $lt: banEndDate }
                }),
                {}
            );
        });

        it('should ignore multiple users by id', async () => {
            // Arrange
            const userIdsToIgnore = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue([]);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            await UserService.getMany({ ignoreUserId: userIdsToIgnore.map(id => id.toString()) });

            // Assert
            expect(userModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    _id: { $nin: userIdsToIgnore }
                }),
                {}
            );
        });
    });

    describe('updateStatusMany', () => {
        it('should update the status of multiple users', async () => {
            // Arrange
            const userIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
            const mockUsers = userIds.map(id => ({
                _id: id,
                statusId: StatusId.Active,
                lastAuthorId: '',
                save: jest.fn<() => Promise<any>>().mockResolvedValue({}),
            }));

            (userModel.find as jest.Mock).mockReturnValue({
                exec: jest.fn<() => Promise<any[]>>().mockResolvedValue(mockUsers),
            });
            const lastAuthorId = new mongoose.Types.ObjectId().toString();

            // Act
            const results = await UserService.updateStatusMany({
                _id: userIds.map(id => id.toString()),
                statusId: StatusId.Banned,
                lastAuthorId: lastAuthorId,
            });

            // Assert
            expect(userModel.find).toHaveBeenCalledWith({ _id: { $in: userIds } });
            expect(mockUsers[0].save).toHaveBeenCalled();
            expect(mockUsers[1].save).toHaveBeenCalled();
            expect(mockUsers[0].statusId).toBe(StatusId.Banned);
            expect(mockUsers[1].statusId).toBe(StatusId.Banned);
            expect(results).toHaveLength(2);
            expect(results[0]).toEqual(expect.objectContaining({
                _id: userIds[0],
                statusId: StatusId.Banned,
            }));
        });
    });

    describe('getDetailed', () => {
        it('should redact sensitive data when no session is provided', async () => {
            // Arrange
            const mockUser = createMockUser({ phone: '1234567890', username: 'testuser' });
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), lean: leanMock };
            (userModel.findOne as jest.Mock).mockReturnValue(queryMock);

            // Act
            const user = await UserService.getDetailed({ _id: mockUser._id.toString() });

            // Assert
            expect(user).not.toHaveProperty('password');
            expect(user).not.toHaveProperty('phone');
            expect(user).not.toHaveProperty('username');
        });

        it('should not redact data when a user requests their own profile', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId().toString();
            const mockUser = createMockUser({ _id: userId, phone: '1234567890', username: 'self' });
            const sessionAuth: ISessionAuth = {
                user: {
                    userId: userId,
                    roleId: UserRoleId.User,
                    permissions: [],
                    username: 'self',
                    email: 'self@example.com',
                    name: 'Self User',
                    url: 'self-user',
                    image: 'self.jpg',
                    ip: '127.0.0.1'
                }
            };
            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(mockUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), lean: leanMock };
            (userModel.findOne as jest.Mock).mockReturnValue(queryMock);

            // Act
            const user = await UserService.getDetailed({ _id: userId }, sessionAuth);

            // Assert
            expect(user?.phone).toBe('1234567890');
            expect(user?.username).toBe('self');
        });

        it('should redact username when admin has insufficient rank', async () => {
            // Arrange
            const targetUser = createMockUser({ _id: new mongoose.Types.ObjectId().toString(), roleId: UserRoleId.Admin, username: 'target' });
            const sessionAuth: ISessionAuth = {
                user: {
                    userId: new mongoose.Types.ObjectId().toString(),
                    roleId: UserRoleId.User,
                    permissions: [PermissionId.UserEdit],
                    username: 'requester',
                    email: 'requester@example.com',
                    name: 'Requester User',
                    url: 'requester-user',
                    image: 'requester.jpg',
                    ip: '127.0.0.1'
                }
            };
            (PermissionUtil.checkPermissionId as jest.Mock).mockReturnValue(true);
            (PermissionUtil.checkPermissionRoleRank as jest.Mock).mockReturnValue(false); // Admin has higher rank

            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(targetUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), lean: leanMock };
            (userModel.findOne as jest.Mock).mockReturnValue(queryMock);

            // Act
            const user = await UserService.getDetailed({ _id: targetUser._id.toString() }, sessionAuth);

            // Assert
            expect(user).not.toHaveProperty('username');
        });

        it('should not redact username when admin has sufficient rank', async () => {
            // Arrange
            const targetUser = createMockUser({ _id: new mongoose.Types.ObjectId().toString(), roleId: UserRoleId.User, username: 'target' });
            const sessionAuth: ISessionAuth = {
                user: {
                    userId: new mongoose.Types.ObjectId().toString(),
                    roleId: UserRoleId.Admin,
                    permissions: [PermissionId.UserEdit],
                    username: 'admin',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    url: 'admin-user',
                    image: 'admin.jpg',
                    ip: '127.0.0.1'
                }
            };
            (PermissionUtil.checkPermissionId as jest.Mock).mockReturnValue(true);
            (PermissionUtil.checkPermissionRoleRank as jest.Mock).mockReturnValue(true); // Admin has higher rank

            const execMock = jest.fn<() => Promise<IUserModel | null>>().mockResolvedValue(targetUser);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), lean: leanMock };
            (userModel.findOne as jest.Mock).mockReturnValue(queryMock);

            // Act
            const user = await UserService.getDetailed({ _id: targetUser._id.toString() }, sessionAuth);

            // Assert
            expect(user?.username).toBe('target');
        });
    });

    describe('getManyDetailed', () => {
        it('should return detailed users, filter sensitive data, and set online status', async () => {
            // Arrange
            const onlineUserId = new mongoose.Types.ObjectId().toString();
            const offlineUserId = new mongoose.Types.ObjectId().toString();
            const mockUsers = [
                createMockUser({ _id: onlineUserId, password: 'password1' }),
                createMockUser({ _id: offlineUserId, password: 'password2' }),
            ];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                populate: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Mock the online status check
            (Config.onlineUsers.indexOfKey as jest.Mock).mockImplementation((key, value) => {
                return value === onlineUserId ? 0 : -1;
            });

            // Act
            const users = await UserService.getManyDetailed({});

            // Assert
            expect(users.length).toBe(2);
            // Check filtering
            expect(users[0]).not.toHaveProperty('password');
            expect(users[1]).not.toHaveProperty('phone');
            // Check online status
            const user1 = users.find(u => u._id.toString() === onlineUserId);
            const user2 = users.find(u => u._id.toString() === offlineUserId);
            expect(user1?.isOnline).toBe(true);
            expect(user2?.isOnline).toBe(false);
        });

        it('should handle pagination correctly', async () => {
            // Arrange
            const mockUsers = [createMockUser(), createMockUser()];
            const execMock = jest.fn<() => Promise<IUserModel[]>>().mockResolvedValue(mockUsers);
            const leanMock = jest.fn().mockReturnValue({ exec: execMock });
            const queryMock = {
                populate: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                lean: leanMock,
            };
            (userModel.find as jest.Mock).mockReturnValue(queryMock);

            // Act
            await UserService.getManyDetailed({ page: 2, count: 5 });

            // Assert
            expect(queryMock.skip).toHaveBeenCalledWith(5); // (2 - 1) * 5
            expect(queryMock.limit).toHaveBeenCalledWith(5);
        });
    });
});