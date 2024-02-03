import {object, string, array, number, z} from 'zod';
import {ComponentInputTypeId} from "../constants/componentInputTypes";

const postBody = object({
    elementId: string().min(1),
    langKey: string().min(1),
    types: array(object({
        _id: string().optional(),
        elementId: string().min(1),
        typeId: z.nativeEnum(ComponentInputTypeId),
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

const getOneSchema = object({
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
        _id: array(string().min(1)),
        elementId: array(string().min(1)).default([]),
        langId: string().optional()
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

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
    })
});

export type ComponentSchemaGetOneDocument = z.infer<typeof getOneSchema>;
export type ComponentSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type ComponentSchemaPostDocument = z.infer<typeof postSchema>;
export type ComponentSchemaPutOneDocument = z.infer<typeof putOneSchema>;
export type ComponentSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    getOne: getOneSchema,
    getMany: getManySchema,
    post: postSchema,
    putOne: putOneSchema,
    deleteMany: deleteManySchema
};