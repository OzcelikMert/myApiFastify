import {PostTypeId} from "./postTypes";
import {PostTermTypeId} from "./postTermTypes";
import pagePathUtil from "../utils/pagePath.util";

const PagePaths = {
    auth() {
        return pagePathUtil.setPath("auth");
    },
    gallery() {
        return pagePathUtil.setPath("gallery");
    },
    language(withMainPath: boolean = true) {
        let pathLanguage = withMainPath ? pagePathUtil.setPath("language") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathLanguage);
            },
            one() {
                pathLanguage = pagePathUtil.setPath(pathLanguage, "one");
                return this;
            },
            many() {
                pathLanguage = pagePathUtil.setPath(pathLanguage, "many");
                return this;
            },
            withId(_id: string | number | undefined = ":_id") {
                pathLanguage = pagePathUtil.setPath(pathLanguage, _id);
                return this;
            },
            flags() {
                return pagePathUtil.setPath(pathLanguage, "flags");
            },
            rank() {
                return pagePathUtil.setPath(pathLanguage, "rank");
            }
        }
    },
    serverInfo() {
        return pagePathUtil.setPath("serverInfo");
    },
    mailer() {
        return pagePathUtil.setPath("mailer");
    },
    setting(withMainPath: boolean = true) {
        let pathSetting = withMainPath ? pagePathUtil.setPath("setting") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathSetting);
            },
            seo() {
                return pagePathUtil.setPath(pathSetting, "seo");
            },
            general() {
                return pagePathUtil.setPath(pathSetting, "general");
            },
            contactForm() {
                return pagePathUtil.setPath(pathSetting, "contactForm");
            },
            staticLanguage() {
                return pagePathUtil.setPath(pathSetting, "staticLanguage");
            },
            socialMedia() {
                return pagePathUtil.setPath(pathSetting, "socialMedia");
            },
            eCommerce() {
                return pagePathUtil.setPath(pathSetting, "eCommerce");
            },
        }
    },
    user(withMainPath: boolean = true) {
        let pathUser = withMainPath ? pagePathUtil.setPath("user") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathUser);
            },
            one() {
                pathUser = pagePathUtil.setPath(pathUser, "one");
                return this;
            },
            many() {
                pathUser = pagePathUtil.setPath(pathUser, "many");
                return this;
            },
            withId(_id: string | number | undefined = ":_id") {
                return pagePathUtil.setPath(pathUser, _id);
            },
            withUrl(url: string | undefined = ":url") {
                return pagePathUtil.setPath(pathUser, "url", url);
            },
            profile() {
                return pagePathUtil.setPath(pathUser, "profile");
            },
            changePassword() {
                return pagePathUtil.setPath(pathUser, "changePassword");
            },
        }
    },
    subscriber(withMainPath: boolean = true) {
        let pathSubscriber = withMainPath ? pagePathUtil.setPath("subscriber") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathSubscriber);
            },
            one() {
                pathSubscriber = pagePathUtil.setPath(pathSubscriber, "one");
                return this;
            },
            many() {
                pathSubscriber = pagePathUtil.setPath(pathSubscriber, "many");
                return this;
            },
            withId(_id: string | number | undefined = ":_id") {
                return pagePathUtil.setPath(pathSubscriber, _id);
            },
            withEmail(email: string | number | undefined = ":email") {
                return pagePathUtil.setPath(pathSubscriber, "email", email);
            },
        }
    },
    sitemap(withMainPath: boolean = true) {
        let pathSitemap = withMainPath ? pagePathUtil.setPath("sitemap") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathSitemap);
            },
            post() {
                return pagePathUtil.setPath(pathSitemap, "post");
            },
            postTerm() {
                return pagePathUtil.setPath(pathSitemap, "postTerm");
            },
            maps() {
                return pagePathUtil.setPath(pathSitemap, "maps");
            },
        }
    },
    view(withMainPath: boolean = true) {
        let pathView = withMainPath ? pagePathUtil.setPath("view") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathView);
            },
            one() {
                pathView = pagePathUtil.setPath(pathView, "one");
                return this;
            },
            many() {
                pathView = pagePathUtil.setPath(pathView, "many");
                return this;
            },
            number() {
                return pagePathUtil.setPath(pathView, "number");
            },
            statistics() {
                return pagePathUtil.setPath(pathView, "statistics");
            },
        }
    },
    component(withMainPath: boolean = true) {
        let pathComponent = withMainPath ? pagePathUtil.setPath("component") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathComponent);
            },
            one() {
                pathComponent = pagePathUtil.setPath(pathComponent, "one");
                return this;
            },
            many() {
                pathComponent = pagePathUtil.setPath(pathComponent, "many");
                return this;
            },
            withId(_id: string | number | undefined = ":_id") {
                pathComponent = pagePathUtil.setPath(pathComponent, _id);
                return this;
            },
        }
    },
    navigation(withMainPath: boolean = true) {
        let pathNavigation = withMainPath ? pagePathUtil.setPath("navigation") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathNavigation);
            },
            one() {
                pathNavigation = pagePathUtil.setPath(pathNavigation, "one");
                return this;
            },
            many() {
                pathNavigation = pagePathUtil.setPath(pathNavigation, "many");
                return this;
            },
            status() {
                return pagePathUtil.setPath(pathNavigation, "status");
            },
            rank() {
                return pagePathUtil.setPath(pathNavigation, "rank");
            },
            withId(_id: string | number | undefined = ":_id") {
                pathNavigation = pagePathUtil.setPath(pathNavigation, _id);
                return this;
            },
        }
    },
    post(withMainPath: boolean = true) {
        let pathPost = withMainPath ? pagePathUtil.setPath("post") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathPost);
            },
            one() {
                pathPost = pagePathUtil.setPath(pathPost, "one");
                return this;
            },
            many() {
                pathPost = pagePathUtil.setPath(pathPost, "many");
                return this;
            },
            withTypeId(typeId: string | PostTypeId | undefined = ":typeId") {
                pathPost = pagePathUtil.setPath(pathPost, typeId);
                return this
            },
            withId(_id: string | number | undefined = ":_id") {
                pathPost = pagePathUtil.setPath(pathPost, _id);
                return this
            },
            view() {
                return pagePathUtil.setPath(pathPost, "view");
            },
            count() {
                return pagePathUtil.setPath(pathPost, "count");
            },
            status() {
                return pagePathUtil.setPath(pathPost, "status");
            },
            rank() {
                return pagePathUtil.setPath(pathPost, "rank");
            },
        }
    },
    postTerm(withMainPath: boolean = true) {
        let pathPostTerm = withMainPath ? pagePathUtil.setPath("postTerm") : "";

        return {
            self() {
                return pagePathUtil.setPath(pathPostTerm);
            },
            one() {
                pathPostTerm = pagePathUtil.setPath(pathPostTerm, "one");
                return this;
            },
            many() {
                pathPostTerm = pagePathUtil.setPath(pathPostTerm, "many");
                return this;
            },
            withPostTypeId(postTypeId: string | PostTypeId | undefined = ":postTypeId") {
                pathPostTerm = pagePathUtil.setPath(pathPostTerm, postTypeId);
                return this
            },
            withTypeId(typeId: string | PostTermTypeId | undefined = ":typeId") {
                pathPostTerm = pagePathUtil.setPath(pathPostTerm, typeId);
                return this
            },
            withId(_id: string | number | undefined = ":_id") {
                pathPostTerm = pagePathUtil.setPath(pathPostTerm, _id);
                return this
            },
            status() {
                return pagePathUtil.setPath(pathPostTerm, "status");
            },
            rank() {
                return pagePathUtil.setPath(pathPostTerm, "rank");
            },
        }
    },
}

export default PagePaths;