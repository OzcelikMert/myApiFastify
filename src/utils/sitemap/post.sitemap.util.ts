import languageService from "../../services/language.service";
import SitemapUtil from "../sitemap.util";
import {Config} from "../../config";
import {PostTypeId} from "../../constants/postTypes";
import {PageTypeId} from "../../constants/pageTypes";

export function isPostSitemapRequire(typeId: PostTypeId, expect: PostTypeId[] = []){
    return [PostTypeId.Page, PostTypeId.Blog, PostTypeId.Portfolio, PostTypeId.Product].filter(type => !expect.includes(type)).includes(typeId);
}

export function getPostSitemapName(typeId: PostTypeId){
    const indexOfS = Object.values(PostTypeId).indexOf(typeId);
    return Object.keys(PostTypeId)[indexOfS].toLowerCase();
}

export function  getPostSitemapLoc(typeId: PostTypeId, url: string, pageTypeId?: PageTypeId){
    let sitemapName = typeId == PostTypeId.Page ? "" : `${getPostSitemapName(typeId)}/`;
    url = pageTypeId == PageTypeId.HomePage ? "" : url;
    return `${sitemapName}${url}`;
}

export function  getPostSitemapPriority(typeId: PostTypeId, pageTypeId?: PageTypeId){
    let priority = "0.5";

    if(typeId == PostTypeId.Page){
        priority = "0.8";
    }

    if(pageTypeId == PageTypeId.HomePage){
        priority = "1.0";
    }

    return priority;
}

export default {
    async add(params: {_id: string, typeId: PostTypeId, langId: string, url: string, pageTypeId?: PageTypeId}) {
        let sitemap = "";
        let sitemapName = getPostSitemapName(params.typeId);
        let sitemapUtil = new SitemapUtil(sitemapName);

        let languages = await languageService.select({_id: params.langId});
        if (languages.length > 0) {
            let language = languages[0];
            let loc = getPostSitemapLoc(params.typeId, params.url, params.pageTypeId);
            sitemap = await sitemapUtil.add(
                [{
                    _id: params._id,
                    loc: loc,
                    changefreq: "weekly",
                    priority: getPostSitemapPriority(params.typeId, params.pageTypeId),
                    alternates: [
                        {
                            langShortKey: language.shortKey,
                            langLocale: language.locale,
                            loc: loc
                        }
                    ]
                }]
            );
        }

        return sitemap;
    },
    async update(params: {_id: string, sitemap: string, typeId: PostTypeId, langId: string, url: string, pageTypeId?: PageTypeId}) {
        let sitemapName = getPostSitemapName(params.typeId);
        let sitemapUtil = new SitemapUtil(sitemapName);

        let languages = await languageService.select({_id: params.langId});
        if(languages.length > 0){
            let language = languages[0];
            let loc = getPostSitemapLoc(params.typeId, params.url, params.pageTypeId);
            await sitemapUtil.edit(
                params.sitemap,
                params._id,
                {
                    ...(Config.defaultLangId == params.langId ? {loc: loc} : {}),
                    priority: getPostSitemapPriority(params.typeId, params.pageTypeId),
                    alternates: [
                        {
                            langShortKey: language.shortKey,
                            langLocale: language.locale,
                            loc: loc
                        }
                    ]
                }
            );
        }
    },
    async delete(params: {_id: string, sitemap: string, typeId: PostTypeId}) {
        let sitemap = "";
        let sitemapName = getPostSitemapName(params.typeId);
        let sitemapUtil = new SitemapUtil(sitemapName);

        await sitemapUtil.delete(params.sitemap, params._id);

        return sitemap;
    },
};