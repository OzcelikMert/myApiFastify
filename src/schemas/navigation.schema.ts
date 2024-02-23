import {object, string, number, array, boolean, z} from 'zod';
import {StatusId} from "../constants/status";

const postBody = object({
    mainId: string().optional(),
    statusId: z.nativeEnum(StatusId),
    rank: number().min(1),
    contents: object({
        langId: string().min(1),
        title: string().default(""),
        url: string().optional(),
    }),
})

const getWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        langId: string().optional(),
        statusId: z.nativeEnum(StatusId).optional()
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        langId: string().optional(),
        statusId: z.nativeEnum(StatusId).optional(),
        ignoreDefaultLanguage: boolean().optional()
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

const putManyStatusSchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
        statusId: z.nativeEnum(StatusId)
    })
});

const putWithIdRankSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        rank: number().min(1)
    })
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
    })
});

export type INavigationGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type INavigationGetManySchema = z.infer<typeof getManySchema>;
export type INavigationPostSchema = z.infer<typeof postSchema>;
export type INavigationPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type INavigationPutManyStatusSchema = z.infer<typeof putManyStatusSchema>;
export type INavigationPutWithIdRankSchema = z.infer<typeof putWithIdRankSchema>;
export type INavigationDeleteManySchema = z.infer<typeof deleteManySchema>;

export const NavigationSchema = {
    getWithId: getWithIdSchema,
    getMany: getManySchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    putManyStatus: putManyStatusSchema,
    putWithIdRank: putWithIdRankSchema,
    deleteMany: deleteManySchema
};