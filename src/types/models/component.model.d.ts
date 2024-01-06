export interface ComponentDocument {
    _id?: string,
    authorId: string
    lastAuthorId: string
    elementId: string
    langKey: string,
    types: ComponentTypeDocument[]
}

export interface ComponentTypeDocument {
    _id?: string,
    elementId: string
    typeId: number,
    langKey: string,
    rank: number,
    contents: ComponentTypeContentDocument[]
}

export interface ComponentTypeContentDocument {
    _id?: string,
    langId: string
    content?: string
    url?: string
    comment?: string
}