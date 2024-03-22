import {object, string, number, array, boolean, z, coerce} from 'zod';
import {StatusId} from "../constants/status";
import {ZodUtil} from "../utils/zod.util";

const postBody = object({
    mainId: string().optional().default(""),
    statusId: z.nativeEnum(StatusId),
    rank: number().min(0),
    isPrimary: boolean().optional(),
    isSecondary: boolean().optional(),
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
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional()
    })
});

const getManySchema = object({
    query: object({
        _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
        langId: string().optional(),
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
        isPrimary: coerce.boolean().optional(),
        isSecondary: coerce.boolean().optional(),
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
        _id: array(string().min(1)).min(1),
        statusId: z.nativeEnum(StatusId)
    })
});

const putRankWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        rank: number().min(0)
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
export type INavigationPutStatusManySchema = z.infer<typeof putStatusManySchema>;
export type INavigationPutRankWithIdSchema = z.infer<typeof putRankWithIdSchema>;
export type INavigationDeleteManySchema = z.infer<typeof deleteManySchema>;

export const NavigationSchema = {
    getWithId: getWithIdSchema,
    getMany: getManySchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    putStatusMany: putStatusManySchema,
    putRankWithId: putRankWithIdSchema,
    deleteMany: deleteManySchema
};