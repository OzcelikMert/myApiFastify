import {object, number, z} from 'zod';
import {PostTermTypeId} from "../constants/postTermTypes";
import {PostTypeId} from "../constants/postTypes";

const getPostTermSchema = object({
    query: object({
        typeId: z.nativeEnum(PostTermTypeId),
        postTypeId: z.nativeEnum(PostTypeId),
        page: number().optional(),
    })
});

const getPostSchema = object({
    query: object({
        typeId: z.nativeEnum(PostTypeId),
        page: number().optional(),
    })
});

export type SitemapSchemaGetPostTermDocument = z.infer<typeof getPostTermSchema>;
export type SitemapSchemaGetPostDocument = z.infer<typeof getPostSchema>;

export default {
    getPostTerm: getPostTermSchema,
    getPost: getPostSchema
};