import mongoose from "mongoose";

export class MongoDBHelpers {
    static convertToObjectId(string?: any) {
        if(string){
            try {
                return new mongoose.Types.ObjectId(string)._id;
            }catch (e: any) {}
        }
        return undefined;
    }
    static convertToObjectIdArray(strings: any[]) {
        return strings.map(string => {
            return this.convertToObjectId(string);
        });
    }
    static convertToObjectIdData<T>(data: T, keys: string[]) : T {
        let anyData = data as any;
        for(const dataKey in anyData){
            if(keys.includes(dataKey)){
                if(Array.isArray(anyData[dataKey])){
                    anyData[dataKey] = MongoDBHelpers.convertToObjectIdArray(anyData[dataKey]);
                }else{
                    anyData[dataKey] = MongoDBHelpers.convertToObjectId(anyData[dataKey]);
                }
            }else {
                if(typeof anyData[dataKey] === "object"){
                    anyData[dataKey] = MongoDBHelpers.convertToObjectIdData(anyData[dataKey], keys)
                }
            }
        }
        return anyData;
    }
}