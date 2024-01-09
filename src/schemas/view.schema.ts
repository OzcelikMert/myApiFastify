import {object, string, z} from 'zod';
import {ErrorCodes} from "../library/api";

const postSchema = object({
    body: object({
        langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        url: string().default(""),
    })
});

export type ViewSchemaPostDocument = z.infer<typeof postSchema>;

export default {
    post: postSchema
};