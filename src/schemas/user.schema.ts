import { object, string, array, z, ZodIssueCode } from 'zod';
import { UserRoleId } from '@constants/userRoles';
import { StatusId } from '@constants/status';
import { PermissionId } from '@constants/permissions';
import { ZodUtil } from '@utils/zod.util';

const schema = object({
  roleId: z.nativeEnum(UserRoleId),
  statusId: z.nativeEnum(StatusId),
  name: string().min(3),
  username: string()
    .min(2)
    .toLowerCase()
    .regex(/^[a-zA-Z0-9_-]+$/, ZodIssueCode.invalid_string),
  email: string().min(1).email(),
  password: string().min(1),
  permissions: array(z.nativeEnum(PermissionId)).default([]),
  banDateEnd: string().optional(),
  banComment: string().optional(),
});

const getWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
  query: object({
    statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  }),
});

const getWithURLSchema = object({
  params: object({
    url: string().min(1),
  }),
  query: object({
    statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  }),
});

const getManySchema = object({
  query: object({
    _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
    statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
    url: string().optional(),
    count: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    permissions: ZodUtil.convertToArray(
      array(ZodUtil.convertToNumber(z.nativeEnum(PermissionId)))
    ).optional(),
  }),
});

const postSchema = object({
  body: schema,
});

const putWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
  body: schema.merge(
    object({
      password: string().optional(),
    })
  ),
});

const putProfileSchema = object({
  body: object({
    name: string().min(1),
    email: string().min(1).email(),
    comment: string().optional(),
    phone: string().optional(),
    facebook: string().optional(),
    instagram: string().optional(),
    twitter: string().optional(),
  }),
});

const putProfileImageSchema = object({
  body: object({
    image: string().min(1),
  }),
});

const putPasswordSchema = object({
  body: object({
    password: string().min(1),
    newPassword: string().min(1),
  }),
});

const deleteWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
});

export type IUserGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IUserGetManySchema = z.infer<typeof getManySchema>;
export type IUserGetWithURLSchema = z.infer<typeof getWithURLSchema>;
export type IUserPostSchema = z.infer<typeof postSchema>;
export type IUserPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IUserPutProfileSchema = z.infer<typeof putProfileSchema>;
export type IUserPutProfileImageSchema = z.infer<typeof putProfileImageSchema>;
export type IUserPutPasswordSchema = z.infer<typeof putPasswordSchema>;
export type IUserDeleteWithIdSchema = z.infer<typeof deleteWithIdSchema>;

export const UserSchema = {
  getWithId: getWithIdSchema,
  getWithURL: getWithURLSchema,
  getMany: getManySchema,
  post: postSchema,
  putWithId: putWithIdSchema,
  putProfile: putProfileSchema,
  putProfileImage: putProfileImageSchema,
  putPassword: putPasswordSchema,
  deleteWithId: deleteWithIdSchema,
};
