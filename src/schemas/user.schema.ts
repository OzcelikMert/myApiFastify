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

const getOneSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        statusId: z.nativeEnum(StatusId).optional(),
    })
});

const getOneWithURLSchema = object({
    params: object({
        url: string().min(1),
    }),
    query: object({
        statusId: z.nativeEnum(StatusId).optional(),
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)),
        statusId: z.nativeEnum(StatusId).optional(),
        email: string().optional(),
        count: number().optional(),
        page: number().optional(),
    })
});

const postSchema = object({
    body: object(postBody)
});

const putOneSchema = object({
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

const deleteOneSchema = object({
    params: object({
        _id: string().min(1),
    })
});

export type UserSchemaGetDocument = z.infer<typeof getOneSchema>;
export type UserSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type UserSchemaPostDocument = z.infer<typeof postSchema>;
export type UserSchemaPutDocument = z.infer<typeof putOneSchema>;
export type UserSchemaPutProfileDocument = z.infer<typeof putProfileSchema>;
export type UserSchemaPutPasswordDocument = z.infer<typeof putPasswordSchema>;
export type UserSchemaDeleteDocument = z.infer<typeof deleteOneSchema>;

export default {
    getOne: getOneSchema,
    getOneWithURL: getOneWithURLSchema,
    getMany: getManySchema,
    post: postSchema,
    putOne: putOneSchema,
    putProfile: putProfileSchema,
    putPassword: putPasswordSchema,
    deleteOne: deleteOneSchema
};