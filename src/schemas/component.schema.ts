import {object, string, array, number, z} from 'zod';
import {ErrorCodes} from "../library/api";

const postBody = object({
    elementId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    langKey: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    types: (array(object({
        _id: string(),
        elementId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        langKey: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        rank: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        contents: object({
            _id: string(),
            url: string(),
            comment: string(),
            langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            content: string()
        }).required()
    }))).default([])
});

const getSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        elementId: string(),
        langId: string(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })),
        elementId: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        langId: string()
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

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

export type ComponentSchemaGetDocument = z.infer<typeof getSchema>;
export type ComponentSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type ComponentSchemaPostDocument = z.infer<typeof postSchema>;
export type ComponentSchemaPutDocument = z.infer<typeof putSchema>;
export type ComponentSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    get: getSchema,
    getMany: getManySchema,
    post: postSchema,
    put: putSchema,
    deleteMany: deleteManySchema
};