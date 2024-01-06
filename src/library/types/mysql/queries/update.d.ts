import MySql, {QueryValueTypes} from "../../../mysql";

interface UpdateSetDocument {
    columnName: string
    value: any
    valueType?: QueryValueTypes
}

interface UpdateDocument {
    set(...args: UpdateSetDocument[]): MySql,
    setWithArray(args: UpdateSetDocument[]): MySql,
}