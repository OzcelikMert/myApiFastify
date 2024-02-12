import {object, string, z} from 'zod';

const postSchema = object({
    body: object({
        contactFormId: string().min(1),
        email: string().min(1),
        message: string().min(1),
        replyMessage: string().optional()
    })
});

export type MailerSchemaPostDocument = z.infer<typeof postSchema>;

export const MailerSchema = {
    post: postSchema
};