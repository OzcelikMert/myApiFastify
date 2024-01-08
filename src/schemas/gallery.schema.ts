import {object, string, array, z} from 'zod';
import {ErrorCodes} from "../library/api";

const deleteSchema = object({
    body: object({
        images: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })),
    })
});

export type GallerySchemaDeleteDocument = z.infer<typeof deleteSchema>;

export default {
    delete: deleteSchema
};