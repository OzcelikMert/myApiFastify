import { object, string, z } from 'zod';

const postSchema = object({
  body: object({
    username: string()
      .min(2)
      .toLowerCase()
      .regex(/^[a-zA-Z0-9_-]+$/),
    password: string().min(1),
  }),
});

export type IAuthPostSchema = z.infer<typeof postSchema>;

export const AuthSchema = {
  post: postSchema,
};
