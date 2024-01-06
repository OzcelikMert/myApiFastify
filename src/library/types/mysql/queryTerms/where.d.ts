import {QueryTerms, QueryValueTypes} from "../../../mysql/queryTerms";
import MySql from "../../../mysql";

interface WhereParamDocument {
    columnName: string,
    value: any,
    valueType?: QueryValueTypes
    nextOperator?: "and" | "or"
}

interface WhereDocument {
    in(...params: Array<WhereParamDocument>): MySql
    equals(...params: Array<WhereParamDocument>): MySql,
    notEquals(...params: Array<WhereParamDocument>): MySql,
    like(...params: Array<WhereParamDocument>): MySql,
    notLike(...params: Array<WhereParamDocument>): MySql,
    greaterThen(...params: Array<WhereParamDocument>): MySql,
    greaterEqualsThen(...params: Array<WhereParamDocument>): MySql,
    smallerThen(...params: Array<WhereParamDocument>): MySql,
    smallerEqualsThen(...params: Array<WhereParamDocument>): MySql,
}