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

const getOneSchema = object({
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
        _id: array(string().min(1)).default([]),
        langId: string().optional(),
        statusId: z.nativeEnum(StatusId).optional(),
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
        _id: array(string().min(1)).min(1),
        statusId: z.nativeEnum(StatusId)
    })
});

const putOneRankSchema = object({
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

export type NavigationSchemaGetOneDocument = z.infer<typeof getOneSchema>;
export type NavigationSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type NavigationSchemaPostDocument = z.infer<typeof postSchema>;
export type NavigationSchemaPutOneDocument = z.infer<typeof putOneSchema>;
export type NavigationSchemaPutManyStatusDocument = z.infer<typeof putManyStatusSchema>;
export type NavigationSchemaPutOneRankDocument = z.infer<typeof putOneRankSchema>;
export type NavigationSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    getOne: getOneSchema,
    getMany: getManySchema,
    post: postSchema,
    putOne: putOneSchema,
    putManyStatus: putManyStatusSchema,
    putOneRank: putOneRankSchema,
    deleteMany: deleteManySchema
};