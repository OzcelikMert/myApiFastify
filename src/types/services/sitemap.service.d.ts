export interface SitemapMapPostTermCountDocument {
    typeId: number
    postTypeId: number
    total: number
}

export interface SitemapMapPostCountDocument {
    typeId: number
    total: number
}

export interface SitemapMapsDocument {
    post: SitemapMapPostCountDocument[]
    postTerm: SitemapMapPostTermCountDocument[]
}

export interface SitemapPostTermDocument {
    updatedAt: string
    createdAt: string
    typeId: number
    postTypeId: number
    contents: SitemapContentDocument[]
}

export interface SitemapPostDocument {
    updatedAt: string
    createdAt: string
    typeId: number
    pageTypeId?: number
    contents: SitemapContentDocument[]
}

export interface SitemapContentDocument {
    langId: string
    title: string
    url: string
}

export interface SitemapGetPostTermParamDocument {
    typeId: number
    postTypeId: number
    page?: number
}

export interface SitemapGetPostParamDocument {
    typeId: number
    page?: number
}

export interface SitemapGetPostTermCountParamDocument {
    typeId: number[]
    postTypeId: number[]
}

export interface SitemapGetPostCountParamDocument {
    typeId: number[]
}
