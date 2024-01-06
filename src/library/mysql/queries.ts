import V from "../variable"
import {QueryTerms, QueryValueTypes} from "./queryTerms";
import {InsertDocument, SelectDocument} from "../types/mysql/queries/";
import MySql from "./index";
import {UpdateDocument} from "../types/mysql/queries/update";

export enum QueryTypes {
    Select,
    Insert,
    Update,
    Delete
}

export class Queries extends QueryTerms{
    protected queryType: QueryTypes = QueryTypes.Select;
    protected queryTableName: string = "";
    protected queryColumn: string = "";
    protected queryValues: string = "";

    public select(tableName: string): SelectDocument {
        this.queryType = QueryTypes.Select;
        this.queryTableName = tableName;
        let self: any = this;
        return {
            columns(...args): MySql {
                self.queryColumn = ``;
                args.forEach(arg => {
                    self.queryColumn += `${arg},`;

                })
                self.queryColumn = self.queryColumn.removeLastChar();
                return self;
            },
            columnsWithArray(columnNames) { return this.columns.apply(this.columns, columnNames); }
        }
    }

    public insert(tableName: string) : InsertDocument {
        this.queryType = QueryTypes.Insert;
        this.queryTableName = tableName;
        let self: any = this;
        return {
            columns(...args) {
                self.queryColumn = ``;
                args.forEach(arg => {
                    self.queryColumn += `${arg},`;
                })
                self.queryColumn = self.queryColumn.removeLastChar();
                return this;
            },
            values(...args) {
                self.queryValues = `(`;
                args.forEach(arg => {
                    self.queryValues += `${self.convertValueTypeToQuery(arg.value, arg.valueType)},`;
                })
                self.queryValues = self.queryValues.removeLastChar() + ")";
                return self;
            },
            valuesMulti(args) {
                self.queryValues = "";
                args.forEach(arg => {
                    self.queryValues += `(`;
                    arg.forEach(value => {
                        self.queryValues += `${self.convertValueTypeToQuery(value.value, value.valueType)},`;
                    })
                    self.queryValues = self.queryValues.removeLastChar() + "),";
                });
                self.queryValues = self.queryValues.removeLastChar();
                return self;
            }
        }
    }

    public update(tableName: string) : UpdateDocument {
        this.queryType = QueryTypes.Update;
        this.queryTableName = tableName;
        let self: any = this;
        return {
            set(...args) {
                self.queryColumn = ``;
                args.forEach(arg => {
                    self.queryColumn += `${arg.columnName}=${self.convertValueTypeToQuery(arg.value, arg.valueType)},`;
                })
                self.queryColumn = self.queryColumn.removeLastChar();
                return self;
            },
            setWithArray(values) { return this.set.apply(this.set, values); }
        }
    }

    public delete(tableName: string) : MySql {
        this.queryType = QueryTypes.Delete;
        this.queryTableName = tableName;
        let self: any = this;
        return self;
    }
}