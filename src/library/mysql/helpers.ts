class MySqlHelpers {
    static groupConcat(...columnName: string[]): string {
        return `GROUP_CONCAT(${columnName.join(",")})`;
    }

    static count(columnName: string): string {
        return `COUNT(${columnName})`;
    }

    static concat(...columnName: string[]): string {
        return `CONCAT(${columnName.join(",")})`;
    }

    static asName(columnName: string, newName: string): string {
        return `${columnName} as ${newName}`;
    }

    static jsonArrayAGG(...columnName: string[]): string {
        return `JSON_ARRAYAGG(${columnName.join(",")})`;
    }

    static jsonObject(...values: {key: string, value: any}[]): string {
        let query = "JSON_OBJECT(";
        for (let i = 0; i < values.length; i++){
            let value = values[i];
            query += `'${value.key}', ${value.value},`;
        }
        query = query.removeLastChar() + ")"
        return query;
    }
}

export default MySqlHelpers;