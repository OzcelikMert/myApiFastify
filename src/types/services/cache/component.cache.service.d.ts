import { ComponentTypeId } from "@constants/componentTypes";
import { PageTypeId } from "@constants/pageTypes";
import { PostTypeId } from "@constants/postTypes";

export type IComponentParamCacheService = {
    langId?: string;
    _id?: string[];
    typeId?: ComponentTypeId;
}