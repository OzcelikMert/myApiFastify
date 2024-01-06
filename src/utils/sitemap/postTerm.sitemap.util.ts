import languageService from "../../services/language.service";
import SitemapUtil from "../sitemap.util";
import {Config} from "../../config";
import {PostTypeId} from "../../constants/postTypes";
import {PostTermTypeId} from "../../constants/postTermTypes";
import {getPostSitemapName, isPostSitemapRequire} from "./post.sitemap.util";

export function isPostTermSitemapRequire(typeId: PostTermTypeId, postTypeId: PostTypeId){
    return [PostTermTypeId.Category, PostTermTypeId.Tag].includes(typeId) && isPostSitemapRequire(postTypeId, [PostTypeId.Page]);
}

export function getPostTermSitemapName(typeId: PostTermTypeId){
    const indexOfS = Object.values(PostTermTypeId).indexOf(typeId);
    return Object.keys(PostTermTypeId)[indexOfS].toLowerCase();
}

export function  getPostTermSitemapLoc(typeId: PostTermTypeId, postTypeId: PostTypeId, url: string){
    return `${getPostSitemapName(postTypeId)}/${getPostTermSitemapName(typeId)}/${url}`;
}

export default {
    async add(params: {_id: string, typeId: PostTermTypeId, postTypeId: PostTypeId, langId: string, url: string}) {
        let sitemap = "";
        let sitemapName = getPostSitemapName(params.postTypeId);
        let sitemapUtil = new SitemapUtil(sitemapName);

        let languages = await languageService.select({_id: params.langId});
        if (languages.length > 0) {
            let language = languages[0];
            let loc = getPostTermSitemapLoc(params.typeId, params.postTypeId, params.url);
            sitemap = await sitemapUtil.add(
                [{
                    _id: params._id,
                    loc: loc,
                    changefreq: "weekly",
                    priority: "0.4",
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
    async update(params: {_id: string, sitemap: string, typeId: PostTermTypeId, postTypeId: PostTypeId, langId: string, url: string}) {
        let sitemapName = getPostSitemapName(params.postTypeId);
        let sitemapUtil = new SitemapUtil(sitemapName);

        let languages = await languageService.select({_id: params.langId});
        if(languages.length > 0){
            let language = languages[0];
            let loc = getPostTermSitemapLoc(params.typeId, params.postTypeId, params.url);
            await sitemapUtil.edit(
                params.sitemap,
                params._id,
                {
                    ...(Config.defaultLangId == params.langId ? {loc: loc} : {}),
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