import {object, string, array, number, z} from 'zod';
import {ErrorCodes} from "../library/api";

const postBody = {
    roleId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    name: string().min(3, { message: ErrorCodes.incorrectData.toString() }),
    email: string().min(1, { message: ErrorCodes.emptyValue.toString() }).email({ message: ErrorCodes.incorrectData.toString() }),
    password: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    permissions: array(number().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    banDateEnd: string(),
    banComment: string(),
};

const getSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        statusId: number(),
    })
});

const getWithURLSchema = object({
    params: object({
        url: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        statusId: number(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })),
        statusId: number(),
        email: string(),
        count: number(),
        page: number(),
    })
});

const postSchema = object({
    body: object(postBody)
});

const putSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        ...postBody,
        password: string()
    })
});

const putProfileSchema = object({
    body: object({
        image: string(),
        name: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        comment: string(),
        phone: string(),
        facebook: string().url({ message: ErrorCodes.incorrectData.toString() }),
        instagram: string().url({ message: ErrorCodes.incorrectData.toString() }),
        twitter: string().url({ message: ErrorCodes.incorrectData.toString() })
    })
});

const putPasswordSchema = object({
    body: object({
        password: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        newPassword: string().min(1, { message: ErrorCodes.emptyValue.toString() })
    })
});

const deleteSchema = object({
    params: object({
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

export type UserSchemaGetDocument = z.infer<typeof getSchema>;
export type UserSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type UserSchemaPostDocument = z.infer<typeof postSchema>;
export type UserSchemaPutDocument = z.infer<typeof putSchema>;
export type UserSchemaPutProfileDocument = z.infer<typeof putProfileSchema>;
export type UserSchemaPutPasswordDocument = z.infer<typeof putPasswordSchema>;
export type UserSchemaDeleteDocument = z.infer<typeof deleteSchema>;

export default {
    get: getSchema,
    getWithURL: getWithURLSchema,
    getMany: getManySchema,
    post: postSchema,
    put: putSchema,
    putProfile: putProfileSchema,
    putPassword: putPasswordSchema,
    delete: deleteSchema
};