import {object, string, array, number, z} from 'zod';
import {UserRoleId} from "../constants/userRoles";
import {StatusId} from "../constants/status";
import {PermissionId} from "../constants/permissions";

const postBody = {
    roleId: z.nativeEnum(UserRoleId),
    statusId: z.nativeEnum(StatusId),
    name: string().min(3),
    email: string().min(1).email(),
    password: string().min(1),
    permissions: array(z.nativeEnum(PermissionId)).min(1),
    banDateEnd: string().optional(),
    banComment: string().optional(),
};

const getWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        statusId: z.nativeEnum(StatusId).optional(),
    })
});

const getWithURLSchema = object({
    params: object({
        url: string().min(1),
    }),
    query: object({
        statusId: z.nativeEnum(StatusId).optional(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        statusId: z.nativeEnum(StatusId).optional(),
        email: string().optional(),
        count: z.coerce.number().optional(),
        page: z.coerce.number().optional(),
    })
});

const postSchema = object({
    body: object(postBody)
});

const putWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        ...postBody,
        password: string().optional()
    })
});

const putProfileSchema = object({
    body: object({
        image: string().optional(),
        name: string().min(1),
        comment: string().optional(),
        phone: string().optional(),
        facebook: string().url(),
        instagram: string().url(),
        twitter: string().url()
    })
});

const putPasswordSchema = object({
    body: object({
        password: string().min(1),
        newPassword: string().min(1)
    })
});

const deleteWithIdSchema = object({
    params: object({
        _id: string().min(1),
    })
});

export type IUserGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IUserGetManySchema = z.infer<typeof getManySchema>;
export type IUserGetWithURLSchema = z.infer<typeof getWithURLSchema>;
export type IUserPostSchema = z.infer<typeof postSchema>;
export type IUserPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IUserPutProfileSchema = z.infer<typeof putProfileSchema>;
export type IUserPutPasswordSchema = z.infer<typeof putPasswordSchema>;
export type IUserDeleteWithIdSchema = z.infer<typeof deleteWithIdSchema>;

export const UserSchema = {
    getWithId: getWithIdSchema,
    getWithURL: getWithURLSchema,
    getMany: getManySchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    putProfile: putProfileSchema,
    putPassword: putPasswordSchema,
    deleteWithId: deleteWithIdSchema
};