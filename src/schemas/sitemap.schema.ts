import {object, number, z} from 'zod';
import {ErrorCodes} from "../library/api";

const getPostTermSchema = object({
    query: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        page: number(),
    })
});

const getPostSchema = object({
    query: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        page: number(),
    })
});

export type SitemapSchemaGetPostTermDocument = z.infer<typeof getPostTermSchema>;
export type SitemapSchemaGetPostDocument = z.infer<typeof getPostSchema>;

export default {
    getPostTerm: getPostTermSchema,
    getPost: getPostSchema
};