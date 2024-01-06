import { object, string, ZodObject } from 'zod';
import {ErrorCodes} from "../library/api";

const postSchema = object({
    body: object({
        contactFormId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        email: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        message: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        replyMessage: string()
    })
});

export default {
    post: postSchema
};