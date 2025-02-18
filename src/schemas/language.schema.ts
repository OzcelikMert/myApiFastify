import { array, boolean, number, object, string, z } from 'zod';
import { StatusId } from '@constants/status';
import { ZodUtil } from '@utils/zod.util';

const schema = object({
  title: string().min(1),
  image: string().min(1),
  shortKey: string().min(1),
  locale: string().min(1),
  statusId: z.nativeEnum(StatusId),
  rank: number().default(0),
  isDefault: boolean().default(false),
});

const getWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
});

const getManySchema = object({
  query: object({
    _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
    statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
    shortKey: string().optional(),
    locale: string().optional(),
  }),
});

const getDefaultSchema = object({
  query: object({}),
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

const putRankWithIdSchema = object({
  params: object({
    _id: string().min(1),
  }),
  body: object({
    rank: number().min(0),
  }),
});

export type ILanguageGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type ILanguageGetDefaultSchema = z.infer<typeof getDefaultSchema>;
export type ILanguageGetManySchema = z.infer<typeof getManySchema>;
export type ILanguagePostSchema = z.infer<typeof postSchema>;
export type ILanguagePutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type ILanguagePutRankWithIdSchema = z.infer<typeof putRankWithIdSchema>;

export const LanguageSchema = {
  getWithId: getWithIdSchema,
  getDefault: getDefaultSchema,
  getMany: getManySchema,
  post: postSchema,
  putWithId: putWithIdSchema,
  putRankWithId: putRankWithIdSchema,
};
