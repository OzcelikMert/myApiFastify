import {object, string, z} from 'zod';
import {ErrorCodes} from "../library/api";

const postSchema = object({
    body: object({
        email: string().min(1, { message: ErrorCodes.emptyValue.toString() }).email({ message: ErrorCodes.incorrectData.toString() }),
        password: string().min(1,{ message: ErrorCodes.emptyValue.toString() }),
    }),
});

export default {
  post: postSchema
};

export type AuthSchemaPostDocument = z.infer<typeof postSchema>;
