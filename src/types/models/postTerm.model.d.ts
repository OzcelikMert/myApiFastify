export interface PostTermDocument {
    _id: string
    postTypeId: number,
    typeId: number,
    mainId?: string
    statusId: number,
    authorId: string
    lastAuthorId: string
    rank: number,
    contents: PostTermContentDocument[]
    updatedAt?: string
    createdAt?: string
}

export interface PostTermContentDocument {
    langId: string
    image?: string,
    title?: string,
    shortContent?: string,
    url?: string,
}