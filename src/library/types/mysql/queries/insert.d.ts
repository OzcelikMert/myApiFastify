import MySql, {QueryValueTypes} from "../../../mysql";

interface InsertValuesDocument {
    value: any,
    valueType?: QueryValueTypes
}

interface InsertDocument {
    columns(...args: string[]): InsertDocument,
    values(...args: InsertValuesDocument[]): MySql,
    valuesMulti(args: InsertValuesDocument[][]): MySql,
}