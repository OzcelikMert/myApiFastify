import { object, string, array, z } from 'zod';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';
import { ZodUtil } from '@utils/zod.util';

const schema = object({
  parentId: string().optional(),
  postId: string().min(1),
  postTypeId: z.nativeEnum(PostTypeId),
  statusId: z.nativeEnum(StatusId),
  message: string().min(1),
});

const getWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
  query: object({
    postId: string().optional(),
    postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
    statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
    authorId: string().optional(),
  }),
});

const getManySchema = object({
  query: object({
    _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
    postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
    statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
    authorId: string().optional(),
  }),
});

const postSchema = object({
  body: schema,
});

const putWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
  body: schema,
});

const putLikeWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
  body: object({
    postTypeId: z.nativeEnum(PostTypeId),
    postId: string().min(1),
  }),
});

const putStatusManySchema = object({
  body: object({
    postTypeId: z.nativeEnum(PostTypeId),
    statusId: z.nativeEnum(StatusId),
    postId: string().min(1),
    _id: array(string().min(1)).min(1),
  }),
});

const deleteManySchema = object({
  body: object({
    postTypeId: z.nativeEnum(PostTypeId),
    postId: string().min(1),
    _id: array(string().min(1)).min(1),
  }),
});

export type IPostCommentGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IPostCommentGetManySchema = z.infer<typeof getManySchema>;
export type IPostCommentPostSchema = z.infer<typeof postSchema>;
export type IPostCommentPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostCommentPutLikeWithIdSchema = z.infer<
  typeof putLikeWithIdSchema
>;
export type IPostCommentPutStatusManySchema = z.infer<
  typeof putStatusManySchema
>;
export type IPostCommentDeleteManySchema = z.infer<typeof deleteManySchema>;

export const PostCommentSchema = {
  getWithId: getWithIdSchema,
  getMany: getManySchema,
  post: postSchema,
  putWithId: putWithIdSchema,
  putLikeWithId: putLikeWithIdSchema,
  putStatusMany: putStatusManySchema,
  deleteMany: deleteManySchema,
};
