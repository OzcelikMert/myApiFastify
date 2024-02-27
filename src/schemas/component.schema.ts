import {object, string, array, number, z} from 'zod';
import {StaticContentTypeId} from "../constants/staticContentTypes";

const postBody = object({
    elementId: string().min(1),
    langKey: string().min(1),
    types: array(object({
        _id: string().optional(),
        elementId: string().min(1),
        typeId: z.nativeEnum(StaticContentTypeId),
        langKey: string().min(1),
        rank: number().min(1),
        contents: object({
            _id: string().optional(),
            url: string().optional(),
            comment: string().optional(),
            langId: string().min(1),
            content: string().optional()
        }).required()
    }).required()).default([])
});

const getWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        elementId: string().optional(),
        langId: string().optional(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        elementId: array(string().min(1)).optional(),
        langId: string().optional()
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

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
    })
});

export type IComponentGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IComponentGetManySchema = z.infer<typeof getManySchema>;
export type IComponentPostSchema = z.infer<typeof postSchema>;
export type IComponentPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IComponentDeleteManySchema = z.infer<typeof deleteManySchema>;

export const ComponentSchema = {
    getWithId: getWithIdSchema,
    getMany: getManySchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    deleteMany: deleteManySchema
};