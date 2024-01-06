import V from "../variable"
import {WhereParamDocument, JoinParamDocument, JoinDocument, WhereDocument} from "../types/mysql/queryTerms/";
import MySql from "./index";
import {OrderByDocument} from "../types/mysql/queryTerms/orderBy";


export enum QueryValueTypes {
    String,
    Number,
    Bool,
    Sql
}

export class QueryTerms {
    protected queryWhere: string = "";
    protected queryJoin: string = "";
    protected queryGroupBy: string = "";
    protected queryOrderBy: string = "";
    protected queryLimit: string = "";

    public get where(): WhereDocument {
        let self: any = this;
        self.queryWhere = (!V.isEmpty(self.queryWhere)) ? `${self.queryWhere} and ` : " where ";

        function inOperator(param: WhereParamDocument) {
            if (Array.isArray(param.value)) {
                let inValues = "";
                param.value.forEach(value => {
                    inValues = `${self.convertValueTypeToQuery(value, param.valueType)},`
                });
                self.queryWhere += `${param.columnName} in(${inValues.removeLastChar()})`;
            } else {
                self.queryWhere += `${param.columnName} in(${self.convertValueTypeToQuery(param.value, param.valueType)})`;
            }
        }

        function setQuery(operator: string, params: Array<WhereParamDocument>) {
            self.queryWhere += `(`;
            params.forEach((param, index) => {
                if(operator === "in"){
                    inOperator(param);
                }else {
                    if (Array.isArray(param.value)) {
                        setQuery(operator, param.value.map(value => {
                            return {
                                value: value,
                                columnName: param.columnName,
                                valueType: param.valueType,
                                nextOperator: "or"
                            }
                        }))
                    } else {
                        self.queryWhere += `${param.columnName} ${operator} ${self.convertValueTypeToQuery(param.value, param.valueType)}`;
                    }
                }
                if(index + 1 < params.length) {
                    self.queryWhere += ` ${param.nextOperator ?? "and"} `;
                }
            })
            self.queryWhere += `)`;
            return self;
        }

        return {
            in(...params) {
                return setQuery("in", params);
            },
            equals(...params) {
                return setQuery("=", params);
            },
            notEquals(...params) {
                return setQuery("!=", params);
            },
            like(...params) {
                return setQuery("like", params);
            },
            notLike(...params) {
                return setQuery("not like", params);
            },
            greaterThen(...params) {
                return setQuery(">", params);
            },
            greaterEqualsThen(...params) {
                return setQuery(">=", params);
            },
            smallerThen(...params) {
                return setQuery("<", params);
            },
            smallerEqualsThen(...params) {
                return setQuery("<=", params);
            },
        }
    }

    public get join(): JoinDocument {
        let self: any = this;

        function setQuery(operator: string, params: Array<JoinParamDocument>) {
            params.forEach(param => {
                self.queryJoin += `${operator} join ${param.tableName} on `;
                for (let i = 0; i < param.on.length; i++) {
                    let on = param.on[i];
                    on.valueType = (V.isEmpty(on.valueType)) ? QueryValueTypes.Sql : on.valueType;
                    self.queryJoin += `${on.columnName} = ${self.convertValueTypeToQuery(on.value, on.valueType)} and `;
                }
                self.queryJoin = `${self.queryJoin.removeLastChar(4)} `;
            })
            return self;
        }

        return {
            inner(...params) {
                return setQuery("inner", params);
            },
            left(...params) {
                return setQuery("left", params);
            },
            right(...params) {
                return setQuery("right", params);
            }
        }
    }

    public groupBy(...columnNames: string[]): MySql {
        this.queryGroupBy = (!V.isEmpty(this.queryGroupBy)) ? `${this.queryGroupBy}, ` : "group by ";

        columnNames.forEach(columnName => {
            this.queryGroupBy += `${columnName},`;
        })
        this.queryGroupBy = `${this.queryGroupBy.removeLastChar()}`;

        let self: any = this;
        return self;
    }

    public get orderBy(): OrderByDocument {
        let self: any = this;

        function setQuery(type: string, params: string[]) {
            self.queryOrderBy = (!V.isEmpty(self.queryOrderBy)) ? `${self.queryOrderBy}, ` : "order by ";
            params.forEach(param => {
                self.queryOrderBy += `${param},`;
            })
            self.queryOrderBy = `${self.queryOrderBy.removeLastChar()} ${type} `;
            return self;
        }

        return {
            asc(...params) {
                return setQuery("asc", params);
            },
            desc(...params) {
                return setQuery("desc", params);
            }
        }
    }

    public limit(count: number, start: number = 0): MySql {
        this.queryLimit = `limit `;
        if (start > 0) this.queryLimit += `${start}, ${count} `;
        else this.queryLimit += `${count} `;

        let self: any = this;
        return self;
    }

    protected convertValueTypeToQuery(value: any, valueType?: QueryValueTypes): string {
        let result = "";
        switch (valueType) {
            case QueryValueTypes.Bool:
            case QueryValueTypes.Sql:
            case QueryValueTypes.Number:
                result = value;
                break;
            default:
            case QueryValueTypes.String:
                result = `'${value}'`;
                break;
        }
        return result;
    }
}