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

const getWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        statusId: z.nativeEnum(StatusId).optional(),
        langId: string().optional(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        typeId: array(z.nativeEnum(PostTermTypeId)).optional(),
        postTypeId: z.nativeEnum(PostTypeId),
        statusId: z.nativeEnum(StatusId).optional(),
        withPostCount: boolean().optional(),
        langId: string().optional(),
        title: string().optional(),
        count: number().optional(),
        page: number().optional(),
        ignoreDefaultLanguage: boolean().optional()
    })
});

const getWithURLSchema = object({
    params: object({
        url: string().min(1),
    }),
    query: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        statusId: z.nativeEnum(StatusId).optional(),
        langId: string().optional(),
    })
});

const postSchema = object({
    body: postBody
});

const putWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: postBody
});

const putStatusManySchema = object({
    body: object({
        postTypeId: z.nativeEnum(PostTypeId),
        typeId: z.nativeEnum(PostTermTypeId),
        statusId: z.nativeEnum(StatusId),
        _id: array(string().min(1)).min(1),
    })
});

const putRankWithIdSchema = object({
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

export type IPostTermGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IPostTermGetManySchema = z.infer<typeof getManySchema>;
export type IPostTermGetWithURLSchema = z.infer<typeof getWithURLSchema>;
export type IPostTermPostSchema = z.infer<typeof postSchema>;
export type IPostTermPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostTermPutStatusManySchema = z.infer<typeof putStatusManySchema>;
export type IPostTermPutRankWithIdSchema = z.infer<typeof putRankWithIdSchema>;
export type IPostTermDeleteManySchema = z.infer<typeof deleteManySchema>;

export const PostTermSchema = {
    getWithId: getWithIdSchema,
    getMany: getManySchema,
    getWithURL: getWithURLSchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    putStatusMany: putStatusManySchema,
    putRankWithId: putRankWithIdSchema,
    deleteMany: deleteManySchema
};