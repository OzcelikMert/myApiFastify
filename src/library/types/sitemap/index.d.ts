export interface SitemapAttrDocument {
    "xmlns:xsi"?: string
    "xmlns:xsd"?: string
    "xmlns"?: string
    "xmlns:xhtml"?: string
    "xsi:schemaLocation"?: string
}

export interface SitemapChildrenXHTMLLinkAttrDocument {
    rel: "alternate",
    hreflang: string,
    href: string
}

export interface SitemapChildrenDocument {
    _id?: string
    loc?: string,
    lastmod?: string,
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority?: string
    "xhtml:link"?: {
        $: SitemapChildrenXHTMLLinkAttrDocument
    }[]
}

export interface SitemapDocument {
    urlset: {
        $?: SitemapAttrDocument
        url?: SitemapChildrenDocument[]
    }
}