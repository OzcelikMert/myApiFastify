import {object, string, array, z} from 'zod';

const getOneSchema = object({
    params: object({
        _id: string().min(1),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        email: array(string().min(1).email()).optional()
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

export type ISubscriberGetOneSchema = z.infer<typeof getOneSchema>;
export type ISubscriberGetManySchema = z.infer<typeof getManySchema>;
export type ISubscriberGetOneWithEmailSchema = z.infer<typeof getOneWithEmailSchema>;
export type ISubscriberPostSchema = z.infer<typeof postSchema>;
export type ISubscriberDeleteOneSchema = z.infer<typeof deleteOneSchema>;
export type ISubscriberDeleteManySchema = z.infer<typeof deleteManySchema>;
export type ISubscriberDeleteOneWithEmailSchema = z.infer<typeof deleteOneWithEmailSchema>;

export const SubscriberSchema = {
    getOne: getOneSchema,
    getMany: getManySchema,
    getOneWithEmail: getOneWithEmailSchema,
    post: postSchema,
    deleteOne: deleteOneSchema,
    deleteMany: deleteManySchema,
    deleteOneWithEmail: deleteOneWithEmailSchema
};