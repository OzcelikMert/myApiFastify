import {object, string, number, array, boolean, ZodObject, z} from 'zod';
import {ErrorCodes} from "../library/api";
import {ProductTypeId} from "../constants/productTypes";

const postBody = object({
    statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    pageTypeId: number(),
    categories: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
    tags: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
    dateStart: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    rank: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    isFixed: boolean().default(false),
    contents: object({
        langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        title: string().min(3, {message: ErrorCodes.incorrectData.toString()}),
        image: string(),
        icon: string(),
        url: string(),
        content: string(),
        shortContent: string(),
        buttons: array(object({
            title: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            url: string()
        })).default([])
    }),
    beforeAndAfter: object({
        imageBefore: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        imageAfter: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        images: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
    }),
    components: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
    eCommerce: object({
        typeId: number().default(ProductTypeId.SimpleProduct),
        images: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        pricing: object({
            taxRate: number().default(0),
            taxExcluded: number().default(0),
            taxIncluded: number().default(0),
            compared: number().default(0),
            shipping: number().default(0),
        }),
        inventory: object({
            sku: string().default(""),
            quantity: number().default(0),
            isManageStock: boolean().default(false)
        }),
        shipping: object({
            width: string().default(""),
            height: string().default(""),
            depth: string().default(""),
            weight: string().default(""),
        }),
        attributes: array(object({
            typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
            attributeId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            variations: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        })).default([]),
        variations: array(object({
            selectedVariations: array(object({
                attributeId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
                variationId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            })).default([]),
            images: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
            rank: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
            pricing: object({
                taxRate: number().default(0),
                taxExcluded: number().default(0),
                taxIncluded: number().default(0),
                compared: number().default(0),
                shipping: number().default(0),
            }),
            inventory: object({
                sku: string().default(""),
                quantity: number().default(0),
                isManageStock: boolean().default(false)
            }),
            shipping: object({
                width: string().default(""),
                height: string().default(""),
                depth: string().default(""),
                weight: string().default(""),
            }),
            contents: object({
                langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
                image: string(),
                content: string(),
                shortContent: string(),
            })
        })).default([]),
        variationDefaults: array(object({
            attributeId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            variationId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        })).default([]),
    })
});

const getSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        _id: string(),
        langId: string(),
        url: string(),
        pageTypeId: number(),
        statusId: number(),
    })
});

const getManySchema = object({
    query: object({
        typeId: array(number().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        pageTypeId: array(number().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        langId: string(),
        title: string(),
        statusId: number(),
        count: number(),
        page: number(),
        ignoreDefaultLanguage: boolean(),
        isRecent: boolean(),
        categories: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
    })
});

const getCountSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    query: object({
        statusId: number(),
        categories: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([]),
        title: string(),
    })
});

const postSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: postBody
});

const putSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: postBody
});

const putManyStatusSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    }),
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
        statusId: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    }),
});

const putRankSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        rank: number().min(1, { message: ErrorCodes.emptyValue.toString() })
    }),
});

const putViewSchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        _id: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        langId: string().min(1, { message: ErrorCodes.emptyValue.toString() })
    }),
});

const deleteManySchema = object({
    params: object({
        typeId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
    }),
    body: object({
        _id: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

export type PostSchemaGetDocument = z.infer<typeof getSchema>;
export type PostSchemaGetManyDocument = z.infer<typeof getManySchema>;
export type PostSchemaGetCountDocument = z.infer<typeof getCountSchema>;
export type PostSchemaPostDocument = z.infer<typeof postSchema>;
export type PostSchemaPutDocument = z.infer<typeof putSchema>;
export type PostSchemaPutManyStatusDocument = z.infer<typeof putManyStatusSchema>;
export type PostSchemaPutRankDocument = z.infer<typeof putRankSchema>;
export type PostSchemaPutViewDocument = z.infer<typeof putViewSchema>;
export type PostSchemaDeleteManyDocument = z.infer<typeof deleteManySchema>;

export default {
    get: getSchema,
    getMany: getManySchema,
    getCount: getCountSchema,
    post: postSchema,
    put: putSchema,
    putManyStatus: putManyStatusSchema,
    putRank: putRankSchema,
    putView: putViewSchema,
    deleteMany: deleteManySchema
};