import { jest } from '@jest/globals';

export const postModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  deleteMany: jest.fn(),
  countDocuments: jest.fn(),
};