import {object, string, array, z} from 'zod';

const getOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        email: string().email()
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).default([]),
        email: string().email()
    }),
});

const postSchema = object({
    body: object({
        email: string().min(1).email(),
    })
});

const deleteOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        email: string().min(1).email(),
    })
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
    })
});

export type SubscriberSchemaGetDocument = z.infer<typeof getOneSchema>;
export type SubscriberSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type SubscriberSchemaPostDocument = z.infer<typeof postSchema>;
export type SubscriberSchemaDeleteDocument = z.infer<typeof deleteOneSchema>;
export type SubscriberSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    getOne: getOneSchema,
    getMany: getManySchema,
    post: postSchema,
    deleteOne: deleteOneSchema,
    deleteMany: deleteManySchema
};