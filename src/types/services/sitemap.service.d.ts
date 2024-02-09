export interface ISitemapMapPostTermCountService {
    typeId: number
    postTypeId: number
    total: number
}

export interface ISitemapMapPostCountService {
    typeId: number
    total: number
}

export interface ISitemapMapsService {
    post: ISitemapMapPostCountService[]
    postTerm: ISitemapMapPostTermCountService[]
}

export interface ISitemapPostTermService {
    updatedAt: string
    createdAt: string
    typeId: number
    postTypeId: number
    contents: ISitemapContentService[]
}

export interface ISitemapPostService {
    updatedAt: string
    createdAt: string
    typeId: number
    pageTypeId?: number
    contents: ISitemapContentService[]
}

export interface ISitemapContentService {
    langId: string
    title: string
    url: string
}

export interface ISitemapGetPostTermParamService {
    typeId: number
    postTypeId: number
    page?: number
}

export interface ISitemapGetPostParamService {
    typeId: number
    page?: number
}

export interface ISitemapGetPostTermCountParamService {
    typeId: number[]
    postTypeId: number[]
}

export interface ISitemapGetPostCountParamService {
    typeId: number[]
}
