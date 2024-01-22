import {object, string, array, number, z} from 'zod';
import {StatusId} from "../constants/status";

const postBody = object({
    title: string().min(1),
    image: string().min(1),
    shortKey: string().min(1),
    locale: string().min(1),
    statusId: z.nativeEnum(StatusId),
    rank: number().default(0)
});

const getOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        shortKey: string().optional(),
        locale: string().optional(),
    }),
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).default([]),
        statusId: z.nativeEnum(StatusId).optional()
    })
});

const postSchema = object({
    body: postBody,
});

const putOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: postBody
});

const putOneRankSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        rank: number().min(1)
    })
});

export type LanguageSchemaGetDocument = z.infer<typeof getOneSchema>;
export type LanguageSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type LanguageSchemaPostDocument = z.infer<typeof postSchema>;
export type LanguageSchemaPutDocument = z.infer<typeof putOneSchema>;
export type LanguageSchemaPutRankDocument = z.infer<typeof putOneRankSchema>;

export default {
    getOne: getOneSchema,
    getMany: getManySchema,
    post: postSchema,
    putOne: putOneSchema,
    putOneRank: putOneRankSchema,
};