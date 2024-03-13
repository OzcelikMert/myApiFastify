import {object, string, number, array, boolean, z} from 'zod';
import {ElementTypeId} from "../constants/elementTypes";
import {ComponentTypeId} from "../constants/componentTypes";
import {ZodUtil} from "../utils/zod.util";

const postBody = object({
    elementId: string().min(1),
    title: string().min(1),
    typeId: z.nativeEnum(ComponentTypeId),
    elements: (array(object({
        _id: string().optional(),
        elementId: string().min(1),
        typeId: z.nativeEnum(ElementTypeId),
        title: string().min(1),
        rank: number().min(1),
        contents: object({
            url: string().optional(),
            langId: string().min(1),
            content: string().optional()
        })
    }))).min(1)
})

const getWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        langId: string().optional()
    })
});

const getWithElementIdSchema = object({
    params: object({
        elementId: string().min(1),
    }),
    query: object({
        langId: string().optional()
    })
});

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        langId: string().optional(),
        elementId: array(string().min(1)).optional(),
        typeId: ZodUtil.convertToNumber(z.nativeEnum(ComponentTypeId)).optional(),
})
});

const postSchema = object({
    body: postBody
});

const putWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: postBody
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)).min(1),
    })
});

export type IComponentGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IComponentGetManySchema = z.infer<typeof getManySchema>;
export type IComponentGetWithElementIdSchema = z.infer<typeof getWithElementIdSchema>;
export type IComponentPostSchema = z.infer<typeof postSchema>;
export type IComponentPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IComponentDeleteManySchema = z.infer<typeof deleteManySchema>;

export const ComponentSchema = {
    getWithId: getWithIdSchema,
    getWithElementId: getWithElementIdSchema,
    getMany: getManySchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    deleteMany: deleteManySchema
};