import mongoose from "mongoose";

class MongoDBHelpers {
    static createObjectId(string?: any) {
        // @ts-ignore
        let returnData = new mongoose.Types.ObjectId()._id;
        if(string){
            try {
                returnData = new mongoose.Types.ObjectId(string)._id;
            }catch (e: any) {}
        }
        return returnData
    }
    static createObjectIdArray(strings: any[]) {
        // @ts-ignore
        return strings.map(string => {
            // @ts-ignore
            let returnData = new mongoose.Types.ObjectId()._id;
            if(string){
                try {
                    returnData = new mongoose.Types.ObjectId(string)._id;
                }catch (e: any) {}
            }
            return returnData
        });
    }
    static convertObjectIdInData<T>(data: T, keys: string[]) : T {
        let anyData = data as any;
        for(const dataKey in anyData){
            if(keys.includes(dataKey)){
                if(Array.isArray(anyData[dataKey])){
                    anyData[dataKey] = MongoDBHelpers.createObjectIdArray(anyData[dataKey]);
                }else{
                    if(anyData[dataKey]){
                        anyData[dataKey] = MongoDBHelpers.createObjectId(anyData[dataKey]);
                    }
                }
            }else {
                if(typeof anyData[dataKey] === "object"){
                    anyData[dataKey] = MongoDBHelpers.convertObjectIdInData(anyData[dataKey], keys)
                }
            }
        }
        return anyData;
    }
}

export default MongoDBHelpers;