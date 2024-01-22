import {object, string, array, z} from 'zod';

const deleteSchema = object({
    body: object({
        images: array(string().min(1)).min(1),
    })
});

export type GallerySchemaDeleteDocument = z.infer<typeof deleteSchema>;

export default {
    delete: deleteSchema
};