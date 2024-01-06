import {SitemapChildrenDocument} from "../../../library/types/sitemap";

export interface SitemapUtilChildrenAlternateDocument {
    langShortKey: string,
    langLocale: string,
    loc: string
}

export type SitemapUtilChildrenDocument = {
    alternates?: SitemapUtilChildrenAlternateDocument[]
} & Omit<SitemapChildrenDocument, "lastmod"|"xhtml:link">