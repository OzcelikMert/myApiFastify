import { object, number, ZodObject } from 'zod';
import {ErrorCodes} from "../library/api";

const getPostTermSchema = object({
    query: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        postTypeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        page: number(),
    })
});

const getPostSchema = object({
    query: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        page: number(),
    })
});

export default {
    getPostTerm: getPostTermSchema,
    getPost: getPostSchema
};