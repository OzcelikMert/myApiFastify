import {object, string, array, z} from 'zod';
import {GalleryTypeId} from "../constants/galleryTypeId";

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        name: array(string().min(1)).optional(),
        typeId: z.nativeEnum(GalleryTypeId).optional(),
    })
});

const deleteManySchema = object({
    body: object({
        _id: array(string().min(1)),
    })
});

export type IGalleryGetManySchema = z.infer<typeof getManySchema>;
export type IGalleryDeleteManySchema = z.infer<typeof deleteManySchema>;

export const GallerySchema = {
    getMany: getManySchema,
    deleteMany: deleteManySchema
};