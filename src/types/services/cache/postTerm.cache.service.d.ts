import { PageTypeId } from "@constants/pageTypes";
import { PostTermTypeId } from "@constants/postTermTypes";
import { PostTypeId } from "@constants/postTypes";

export type IPostTermParamCacheService = {
    langId?: string;
    typeId: PostTermTypeId;
    postTypeId: PostTypeId;
    page?: number;
    count?: number;
}