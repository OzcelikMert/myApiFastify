import { object, string, array, z } from 'zod';
import { ZodUtil } from '@utils/zod.util';

const getWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
});

const getManySchema = object({
  query: object({
    _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
    email: ZodUtil.convertToArray(array(string().min(1).email())).optional(),
  }),
});

const getWithEmailSchema = object({
  params: object({
    email: string().min(1).email(),
  }),
});

const postSchema = object({
  body: object({
    email: string().min(1).email(),
  }),
});

const deleteWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
});

const deleteWithEmailSchema = object({
  params: object({
    email: string().min(1).email(),
  }),
});

const deleteManySchema = object({
  body: object({
    _id: array(string().min(1)).min(1),
  }),
});

export type ISubscriberGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type ISubscriberGetManySchema = z.infer<typeof getManySchema>;
export type ISubscriberGetWithEmailSchema = z.infer<typeof getWithEmailSchema>;
export type ISubscriberPostSchema = z.infer<typeof postSchema>;
export type ISubscriberDeleteWithIdSchema = z.infer<typeof deleteWithIdSchema>;
export type ISubscriberDeleteManySchema = z.infer<typeof deleteManySchema>;
export type ISubscriberDeleteWithEmailSchema = z.infer<
  typeof deleteWithEmailSchema
>;

export const SubscriberSchema = {
  getWithId: getWithIdSchema,
  getMany: getManySchema,
  getWithEmail: getWithEmailSchema,
  post: postSchema,
  deleteWithId: deleteWithIdSchema,
  deleteMany: deleteManySchema,
  deleteWithEmail: deleteWithEmailSchema,
};
