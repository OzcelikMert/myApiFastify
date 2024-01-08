import {object, string, array, number, z} from 'zod';
import {ErrorCodes} from "../library/api";

const postBody = object({
    title: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    image: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    shortKey: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    locale: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    rank: number().default(0)
});

const getSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        shortKey: string(),
        locale: string(),
    }),
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        statusId: number()
    })
});

const postSchema = object({
    body: postBody,
});

const putSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: postBody
});

const putRankSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        rank: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

export type LanguageSchemaGetDocument = z.infer<typeof getSchema>;
export type LanguageSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type LanguageSchemaPostDocument = z.infer<typeof postSchema>;
export type LanguageSchemaPutDocument = z.infer<typeof putSchema>;
export type LanguageSchemaPutRankDocument = z.infer<typeof putRankSchema>;

export default {
    get: getSchema,
    getMany: getManySchema,
    post: postSchema,
    put: putSchema,
    putRank: putRankSchema,
};