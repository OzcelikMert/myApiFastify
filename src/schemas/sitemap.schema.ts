import { object, z } from 'zod';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PostTypeId } from '@constants/postTypes';
import { ZodUtil } from '@utils/zod.util';

const getPostTermSchema = object({
  query: object({
    typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTermTypeId)),
    postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
    page: z.coerce.number().optional(),
  }),
});

const getPostSchema = object({
  query: object({
    typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
    page: z.coerce.number().optional(),
  }),
});

export type ISitemapGetPostTermSchema = z.infer<typeof getPostTermSchema>;
export type ISitemapGetPostSchema = z.infer<typeof getPostSchema>;

export const SitemapSchema = {
  getPostTerm: getPostTermSchema,
  getPost: getPostSchema,
};
