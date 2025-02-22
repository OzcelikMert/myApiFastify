import { object, string, z, ZodIssueCode } from 'zod';

const postSchema = object({
  body: object({
    username: string()
      .min(2)
      .toLowerCase()
      .regex(/^[a-zA-Z0-9_-]+$/, ZodIssueCode.invalid_string),
    password: string().min(1),
  }),
});

export type IAuthPostSchema = z.infer<typeof postSchema>;

export const AuthSchema = {
  post: postSchema,
};
