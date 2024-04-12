import {object, string, z} from 'zod';

const postSchema = object({
    body: object({
        langId: string().optional(),
        url: string().default(""),
    })
});

export type IViewPostSchema = z.infer<typeof postSchema>;

export const ViewSchema = {
    post: postSchema
};