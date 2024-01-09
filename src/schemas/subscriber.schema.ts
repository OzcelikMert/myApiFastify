import {object, string, array, z} from 'zod';
import {ErrorCodes} from "../library/api";

const getSchema = object({
    query: object({
        _id: string(),
        email: string().email({ message: ErrorCodes.incorrectData.toString() })
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        email: string().email({ message: ErrorCodes.incorrectData.toString() })
    }),
});

const postSchema = object({
    body: object({
        email: string().min(1, { message: ErrorCodes.emptyValue.toString() }).email({ message: ErrorCodes.incorrectData.toString() }),
    })
});

const deleteSchema = object({
    body: object({
        email: string().min(1, { message: ErrorCodes.emptyValue.toString() }).email({ message: ErrorCodes.incorrectData.toString() }),
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

export type SubscriberSchemaGetDocument = z.infer<typeof getSchema>;
export type SubscriberSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type SubscriberSchemaPostDocument = z.infer<typeof postSchema>;
export type SubscriberSchemaDeleteDocument = z.infer<typeof deleteSchema>;
export type SubscriberSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    get: getSchema,
    getMany: getManySchema,
    post: postSchema,
    delete: deleteSchema,
    deleteMany: deleteManySchema
};