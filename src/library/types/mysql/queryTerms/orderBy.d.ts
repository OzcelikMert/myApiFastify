import MySql from "../../../mysql";

interface OrderByDocument {
    asc(...columnNames: string[]): MySql,
    desc(...columnNames: string[]): MySql,
}