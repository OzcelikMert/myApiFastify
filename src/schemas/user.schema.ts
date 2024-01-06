import { object, string, array, number, ZodObject } from 'zod';
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
    query: object({
        _id: string(),
        url: string(),
        statusId: number(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
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

export default {
    get: getSchema,
    getMany: getManySchema,
    post: postSchema,
    put: putSchema,
    putProfile: putProfileSchema,
    putPassword: putPasswordSchema,
    delete: deleteSchema
};