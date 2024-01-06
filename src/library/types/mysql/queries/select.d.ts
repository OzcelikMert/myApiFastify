import MySql from "../../../mysql";

interface SelectDocument {
    columns(...args: string[]): MySql,
    columnsWithArray(args: string[]): MySql,
}