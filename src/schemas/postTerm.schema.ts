import {object, string, array, boolean, number, z} from 'zod';
import {StatusId} from "../constants/status";
import {PostTypeId} from "../constants/postTypes";
import {PostTermTypeId} from "../constants/postTermTypes";

const postBody = object({
    postTypeId: z.nativeEnum(PostTypeId),
    typeId: z.nativeEnum(PostTermTypeId),
    statusId: z.nativeEnum(StatusId),
    mainId: string().optional(),
    rank: number().default(0),
    contents: object({
        langId: string().min(1),
        title: string().min(3),
        image: string().optional(),
        url: string().optional(),
    })
})

const getOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        statusId: z.nativeEnum(StatusId).optional(),
        url: string().optional(),
        langId: string().optional(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).default([]),
        typeId: array(z.nativeEnum(PostTermTypeId)).default([]),
        postTypeId: z.nativeEnum(PostTypeId),
        statusId: z.nativeEnum(StatusId).optional(),
        withPostCount: boolean().default(false),
        langId: string().optional(),
        title: string().optional(),
        count: number().optional(),
        page: number().optional(),
        ignoreDefaultLanguage: boolean().optional()
    })
});

const postSchema = object({
    body: postBody
});

const putOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: postBody
});

const putManyStatusSchema = object({
    body: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        statusId: z.nativeEnum(StatusId),
        _id: array(string().min(1)).min(1),
    })
});

const putOneRankSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        rank: number().min(1)
    })
});

const deleteManySchema = object({
    body: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        _id: array(string().min(1)).min(1),
    })
});

export type PostTermSchemaGetDocument = z.infer<typeof getOneSchema>;
export type PostTermSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type PostTermSchemaPostDocument = z.infer<typeof postSchema>;
export type PostTermSchemaPutDocument = z.infer<typeof putOneSchema>;
export type PostTermSchemaPutManyStatusDocument = z.infer<typeof putManyStatusSchema>;
export type PostTermSchemaPutRankDocument = z.infer<typeof putOneRankSchema>;
export type PostTermSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    getOne: getOneSchema,
    getMany: getManySchema,
    post: postSchema,
    putOne: putOneSchema,
    putManyStatus: putManyStatusSchema,
    putOneRank: putOneRankSchema,
    deleteMany: deleteManySchema
};