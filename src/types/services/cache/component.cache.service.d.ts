import { PageTypeId } from "@constants/pageTypes";
import { PostTypeId } from "@constants/postTypes";

export type IComponentParamCacheService = {
    langId?: string;
    _id?: string;
}

export type IComponentManyParamCacheService = {
    _id?: string[];
}