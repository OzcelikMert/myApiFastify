import {object, string, array, z} from 'zod';

const getOneSchema = object({
    params: object({
        _id: string().min(1),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).default([]),
        email: string().email()
    }),
});

const getOneWithEmailSchema = object({
    params: object({
        email: string().min(1).email(),
    })
});

const postSchema = object({
    body: object({
        email: string().min(1).email(),
    })
});

const deleteOneSchema = object({
    params: object({
        _id: string().min(1),
    })
});

const deleteOneWithEmailSchema = object({
    params: object({
        email: string().min(1).email(),
    })
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
    })
});

export type SubscriberSchemaGetOneDocument = z.infer<typeof getOneSchema>;
export type SubscriberSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type SubscriberSchemaGetOneWithEmailDocument = z.infer<typeof getOneWithEmailSchema>;
export type SubscriberSchemaPostDocument = z.infer<typeof postSchema>;
export type SubscriberSchemaDeleteOneDocument = z.infer<typeof deleteOneSchema>;
export type SubscriberSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;
export type SubscriberSchemaDeleteOneWithEmailDocument = z.infer<typeof deleteOneWithEmailSchema>;

export default {
    getOne: getOneSchema,
    getMany: getManySchema,
    getOneWithEmail: getOneWithEmailSchema,
    post: postSchema,
    deleteOne: deleteOneSchema,
    deleteMany: deleteManySchema,
    deleteOneWithEmail: deleteOneWithEmailSchema
};