import { object, string, array, ZodObject } from 'zod';
import {ErrorCodes} from "../library/api";

const deleteSchema = object({
    body: object({
        images: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })),
    })
});

export default {
    delete: deleteSchema
};