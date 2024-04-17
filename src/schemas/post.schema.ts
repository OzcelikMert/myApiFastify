import {object, string, number, array, boolean, z} from 'zod';
import {ProductTypeId} from "@constants/productTypes";
import {StatusId} from "@constants/status";
import {PostTypeId} from "@constants/postTypes";
import {PageTypeId} from "@constants/pageTypes";
import {AttributeTypeId} from "@constants/attributeTypes";
import {ZodUtil} from "@utils/zod.util";
import {PostSortTypeId} from "@constants/postSortTypes";

const postBody = object({
    typeId: z.nativeEnum(PostTypeId),
    statusId: z.nativeEnum(StatusId),
    pageTypeId: z.nativeEnum(PageTypeId).optional(),
    categories: array(string().min(1)).default([]),
    tags: array(string().min(1)).default([]),
    authors: array(string().min(1)).optional(),
    components: array(string().min(1)).optional().default([]),
    dateStart: string().optional(),
    rank: number().min(0),
    isFixed: boolean().default(false),
    isNoIndex: boolean().optional(),
    similarItems: array(string().min(1)).optional(),
    contents: object({
        langId: string().min(1),
        title: string().min(3),
        image: string().optional(),
        icon: string().optional(),
        url: string().optional(),
        content: string().optional(),
        shortContent: string().optional(),
        buttons: array(object({
            title: string().min(1),
            url: string().optional()
        })).default([])
    }),
    beforeAndAfter: object({
        imageBefore: string().min(1),
        imageAfter: string().min(1),
        images: array(string().min(1)).default([]),
    }).optional(),
    eCommerce: object({
        typeId: z.nativeEnum(ProductTypeId).default(ProductTypeId.SimpleProduct),
        images: array(string().min(1)).default([]),
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
            typeId: z.nativeEnum(AttributeTypeId),
            attributeId: string().min(1),
            variations: array(string().min(1)).default([]),
        })).default([]),
        variations: array(object({
            selectedVariations: array(object({
                attributeId: string().min(1),
                variationId: string().min(1),
            })).default([]),
            images: array(string().min(1)).default([]),
            rank: number().min(0),
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
                langId: string().min(1),
                image: string().optional(),
                content: string().optional(),
                shortContent: string().optional(),
            })
        })).default([]),
        variationDefaults: array(object({
            attributeId: string().min(1),
            variationId: string().min(1),
        })).default([]),
    }).optional()
});

const getWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
        langId: string().optional(),
        pageTypeId: ZodUtil.convertToNumber(z.nativeEnum(PageTypeId)).optional(),
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional()
    })
});

const getManySchema = object({
    query: object({
        typeId: ZodUtil.convertToArray(array(ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)))).optional(),
        _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
        pageTypeId: ZodUtil.convertToArray(array(ZodUtil.convertToNumber(z.nativeEnum(PageTypeId)))).optional(),
        langId: string().optional(),
        title: string().optional(),
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
        authorId: string().optional(),
        count: z.coerce.number().optional(),
        page: z.coerce.number().optional(),
        sortTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostSortTypeId)).optional(),
        categories: ZodUtil.convertToArray(array(string().min(1))).optional(),
        tags: ZodUtil.convertToArray(array(string().min(1))).optional(),
        ignorePostId: ZodUtil.convertToArray(array(string().min(1))).optional(),
    })
});

const getWithURLSchema = object({
    params: object({
        url: string().min(1),
    }),
    query: object({
        typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
        langId: string().optional(),
        pageTypeId: ZodUtil.convertToNumber(z.nativeEnum(PageTypeId)).optional(),
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
    })
});

const getPrevNextWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    query: object({
        typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
        langId: string().optional(),
        authorId: string().optional(),
        categories: ZodUtil.convertToArray(array(string().min(1))).optional(),
        tags: ZodUtil.convertToArray(array(string().min(1))).optional()
    })
});

const getCountSchema = object({
    query: object({
        typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
        statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
        categories: ZodUtil.convertToArray(array(string().min(1))).optional(),
        title: string().optional(),
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

const putStatusManySchema = object({
    body: object({
        typeId: z.nativeEnum(PostTypeId),
        _id: array(string().min(1)).min(1),
        statusId: z.nativeEnum(StatusId)
    }),
});

const putRankWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        typeId: z.nativeEnum(PostTypeId),
        rank: number().min(0)
    }),
});

const putViewWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: object({
        typeId: z.nativeEnum(PostTypeId),
        langId: string().optional()
    }),
});

const deleteManySchema = object({
    body: object({
        typeId: z.nativeEnum(PostTypeId),
        _id: array(string().min(1)).min(1),
    })
});

export type IPostGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IPostGetManySchema = z.infer<typeof getManySchema>;
export type IPostGetWithURLSchema = z.infer<typeof getWithURLSchema>;
export type IPostGetPrevNextWithURLSchema = z.infer<typeof getPrevNextWithIdSchema>;
export type IPostGetCountSchema = z.infer<typeof getCountSchema>;
export type IPostPostSchema = z.infer<typeof postSchema>;
export type IPostPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostPutStatusManySchema = z.infer<typeof putStatusManySchema>;
export type IPostPutRankWithIdSchema = z.infer<typeof putRankWithIdSchema>;
export type IPostPutViewWithIdSchema = z.infer<typeof putViewWithIdSchema>;
export type IPostDeleteManySchema = z.infer<typeof deleteManySchema>;

export const PostSchema = {
    getWithId: getWithIdSchema,
    getMany: getManySchema,
    getWithURL: getWithURLSchema,
    getPrevNextWithId: getPrevNextWithIdSchema,
    getCount: getCountSchema,
    post: postSchema,
    putWithId: putWithIdSchema,
    putStatusMany: putStatusManySchema,
    putRankWithId: putRankWithIdSchema,
    putViewWithId: putViewWithIdSchema,
    deleteMany: deleteManySchema
};