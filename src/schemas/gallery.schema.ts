import {object, string, array, z} from 'zod';

const getManySchema = object({
    query: object({
        _id: array(string().min(1)).optional(),
        name: array(string().min(1)).optional(),
    })
});

const deleteManySchema = object({
    body: object({
        name: array(string().min(1)),
    })
});

export type GallerySchemaGetManyDocument = z.infer<typeof getManySchema>;
export type GallerySchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    getMany: getManySchema,
    deleteMany: deleteManySchema
};