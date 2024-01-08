import {object, string, number, array, boolean, z} from 'zod';
import {ErrorCodes} from "../library/api";

const postBody = object({
    mainId: string(),
    statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    rank: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    contents: object({
        langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        title: string().default(""),
        url: string(),
    }),
})

const getSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        langId: string(),
        statusId: number()
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        langId: string(),
        statusId: number(),
        ignoreDefaultLanguage: boolean()
    })
});

const postSchema = object({
    body: postBody
});

const putSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: postBody
});

const putManyStatusSchema = object({
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
        statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

const putRankSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        rank: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

export type NavigationSchemaGetDocument = z.infer<typeof getSchema>;
export type NavigationSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type NavigationSchemaPostDocument = z.infer<typeof postSchema>;
export type NavigationSchemaPutDocument = z.infer<typeof putSchema>;
export type NavigationSchemaPutManyStatusDocument = z.infer<typeof putManyStatusSchema>;
export type NavigationSchemaPutRankDocument = z.infer<typeof putRankSchema>;
export type NavigationSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    get: getSchema,
    getMany: getManySchema,
    post: postSchema,
    put: putSchema,
    putManyStatus: putManyStatusSchema,
    putRank: putRankSchema,
    deleteMany: deleteManySchema
};