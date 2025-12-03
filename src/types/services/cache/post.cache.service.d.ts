import { PageTypeId } from "@constants/pageTypes";
import { PostTypeId } from "@constants/postTypes";

export type IPostParamCacheService = {
    langId?: string;
    typeId?: PostTypeId;
    page?: number;
    count?: number;
    url?: string;
    title?: string;
    categoryId?: string;
    authorId?: string;
}

export type IPostManyParamCacheService = {
    typeId?: PostTypeId[];
} & Omit<IPostParamCacheService, 'typeId'>;