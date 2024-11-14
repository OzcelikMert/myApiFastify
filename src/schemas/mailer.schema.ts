import { object, string, z } from 'zod';

const postSchema = object({
  body: object({
    _id: string().optional(),
    key: string().optional(),
    email: string().min(1).email(),
    message: string().min(1),
  }),
});

export type IMailerPostSchema = z.infer<typeof postSchema>;

export const MailerSchema = {
  post: postSchema,
};
