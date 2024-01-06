import { object, string, array, boolean, number, ZodObject } from 'zod';
import {ErrorCodes} from "../library/api";

const postBody = object({
    mainId: string(),
    statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    rank: number().default(0),
    contents: object({
        langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        title: string().min(3, { message: ErrorCodes.incorrectData.toString() }),
        image: string(),
        url: string(),
    })
})

const getSchema = object({
    params: object({
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        _id: string(),
        url: string(),
        langId: string(),
        statusId: number(),
    })
});

const getManySchema = object({
    params: object({
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        typeId: array(number().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        withPostCount: boolean().default(false),
        langId: string(),
        statusId: number(),
        title: string(),
        count: number(),
        page: number(),
        ignoreDefaultLanguage: boolean()
    })
});

const postSchema = object({
    params: object({
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: postBody
});

const putSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: postBody
});

const putManyStatusSchema = object({
    params: object({
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
        statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

const putRankSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        rank: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

const deleteManySchema = object({
    params: object({
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});


export default {
    get: getSchema,
    getMany: getManySchema,
    post: postSchema,
    put: putSchema,
    putManyStatus: putManyStatusSchema,
    putRank: putRankSchema,
    deleteMany: deleteManySchema
};