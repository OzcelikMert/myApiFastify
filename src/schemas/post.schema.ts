import {object, string, number, array, boolean, z} from 'zod';
import {ProductTypeId} from "@constants/productTypes";
import {StatusId} from "@constants/status";
import {PostTypeId} from "@constants/postTypes";
import {PageTypeId} from "@constants/pageTypes";
import {AttributeTypeId} from "@constants/attributeTypes";
import {ZodUtil} from "@utils/zod.util";
import {PostSortTypeId} from "@constants/postSortTypes";

const schemaECommerceShipping = object({
    width: string().default(""),
    height: string().default(""),
    depth: string().default(""),
    weight: string().default(""),
});

const schemaECommerceInventory = object({
    sku: string().default(""),
    quantity: number().default(0),
    isManageStock: boolean().default(false)
});

const schemaECommercePricing = object({
    taxRate: number().default(0),
    taxExcluded: number().default(0),
    taxIncluded: number().default(0),
    compared: number().default(0),
    shipping: number().default(0),
});

const schemaECommerceAttribute = object({
    typeId: z.nativeEnum(AttributeTypeId),
    attributeId: string().min(1),
    variations: array(string().min(1)),
});

const schemaECommerceVariationSelected = object({
    attributeId: string().min(1),
    variationId: string().min(1),
});

const schemaECommerceVariationItem = object({
    selectedVariations: array(schemaECommerceVariationSelected).default([]),
    itemId: string().min(1)
});

const schemaECommerce = object({
    typeId: z.nativeEnum(ProductTypeId),
    images: array(string().min(1)).default([]),
    pricing: schemaECommercePricing,
    inventory: schemaECommerceInventory,
    shipping: schemaECommerceShipping,
    attributes: array(schemaECommerceAttribute).default([]),
    variationItems: array(schemaECommerceVariationItem).default([]),
    variationDefaults: array(schemaECommerceVariationSelected).default([]),
}).optional()

const schemaContentButton = object({
    title: string().min(1),
    url: string().optional()
});

const schemaBeforeAndAfter = object({
    imageBefore: string().min(1),
    imageAfter: string().min(1),
    images: array(string().min(1)).default([]),
});

const schemaContent = object({
    langId: string().min(1),
    title: string().min(3),
    image: string().optional(),
    icon: string().optional(),
    url: string().optional(),
    content: string().optional(),
    shortContent: string().optional(),
    buttons: array(schemaContentButton).optional()
});

const schema = object({
    parentId: string().optional(),
    typeId: z.nativeEnum(PostTypeId),
    statusId: z.nativeEnum(StatusId),
    pageTypeId: z.nativeEnum(PageTypeId).optional(),
    categories: array(string().min(1)).default([]),
    tags: array(string().min(1)).default([]),
    authors: array(string().min(1)).optional(),
    dateStart: string().optional(),
    rank: number().min(0),
    isFixed: boolean().default(false),
    isNoIndex: boolean().optional(),
    contents: schemaContent,
    eCommerce: schemaECommerce.optional(),
    beforeAndAfter: schemaBeforeAndAfter.optional(),
    components: array(string().min(1)).optional(),
    similarItems: array(string().min(1)).optional(),
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
        authorId: string().optional(),
    })
});

const postSchema = object({
    body: schema
});

const putWithIdSchema = object({
    params: object({
        _id: string().min(1),
    }),
    body: schema
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
        langId: string().optional(),
        url: string().optional()
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