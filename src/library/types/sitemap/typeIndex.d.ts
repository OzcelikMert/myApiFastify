export interface SitemapIndexAttrDocument {
    "xmlns:xsi"?: string
    "xmlns:xsd"?: string
    "xmlns"?: string
}

export interface SitemapIndexChildrenDocument {
    loc: string
}

export interface SitemapIndexDocument {
    sitemapindex: {
        $?: SitemapIndexAttrDocument
        sitemap?: SitemapIndexChildrenDocument[]
    }
}