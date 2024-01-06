import {Queries, QueryTypes} from "./queries";
import {QueryValueTypes} from "./queryTerms";
import MySqlHelpers from "./helpers";

class MySql extends Queries{
    private conn: any = null;

    constructor(conn: any) {
        super();
        this.conn = conn;
    }

    public run(justShowSql = false): any {
        let queryString = "";
        let result: any;

        switch (this.queryType){
            case QueryTypes.Select:
                queryString = `
                    select ${this.queryColumn} from ${this.queryTableName} 
                    ${this.queryJoin} 
                    ${this.queryWhere} 
                    ${this.queryGroupBy} 
                    ${this.queryOrderBy} 
                    ${this.queryLimit}
                `;
                break;
            case QueryTypes.Insert:
                queryString = `insert into ${this.queryTableName}(${this.queryColumn}) values ${this.queryValues}`;
                break;
            case QueryTypes.Update:
                queryString = `
                    update ${this.queryTableName} set ${this.queryColumn} 
                    ${this.queryWhere} 
                    ${this.queryLimit}
                `;
                break
            case QueryTypes.Delete:
                queryString = `
                    delete from ${this.queryTableName} 
                    ${this.queryJoin} 
                    ${this.queryWhere} 
                    ${this.queryGroupBy} 
                    ${this.queryLimit}
                `;
                break;
        }

        if (!justShowSql) {
            try { result = this.conn.query(queryString) }
            catch (err) { result = err; }
            finally { if (typeof result == "undefined" || !Array.isArray(result)) result = []; }
        } else result = queryString;
        return result;
    }
}

export {
    QueryValueTypes,
    MySqlHelpers
}
export default MySql