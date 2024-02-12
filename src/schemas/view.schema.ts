import {object, string, z} from 'zod';

const postSchema = object({
    body: object({
        langId: string().min(1),
        url: string().default(""),
    })
});

export type ViewSchemaPostDocument = z.infer<typeof postSchema>;

export const ViewSchema = {
    post: postSchema
};