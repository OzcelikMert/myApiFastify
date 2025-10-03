import * as mongoose from 'mongoose';
import { IUserModel } from 'types/models/user.model';
import { StatusId } from '@constants/status';
import { UserRoleId } from '@constants/userRoles';

export const createMockUser = (overrides: Partial<IUserModel> = {}): IUserModel => {
    const objectId = new mongoose.Types.ObjectId();
    return {
        _id: objectId.toString(),
        name: 'Mock User',
        username: `mockuser_${objectId.toString()}`,
        email: 'mock@example.com',
        password: 'hashed_password',
        image: '',
        statusId: StatusId.Active,
        roleId: UserRoleId.User,
        permissions: [],
        url: 'mock-user',
        ...overrides,
    };
};