import {object, string, z} from 'zod';

const postSchema = object({
    body: object({
        email: string().min(1).email(),
        password: string().min(1),
    }),
});

export type AuthSchemaPostDocument = z.infer<typeof postSchema>;

export const AuthSchema = {
  post: postSchema
};
