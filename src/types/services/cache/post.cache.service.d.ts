import { PageTypeId } from "@constants/pageTypes";
import { PostSortTypeId } from "@constants/postSortTypes";
import { PostTypeId } from "@constants/postTypes";

export type IPostParamCacheService = {
    langId?: string;
    typeId: PostTypeId;
    page?: number;
    count?: number;
    url?: string;
    sortTypeId?: PostSortTypeId;
}