import mongoose from 'mongoose';

export class MongoDBHelpers {
  static createObjectId() {
    return new mongoose.Types.ObjectId()._id;
  }
  static convertToObjectId(string?: any) {
    if (string) {
      try {
        return new mongoose.Types.ObjectId(string)._id;
      } catch (e) {}
    }
    return undefined;
  }
  static convertToObjectIdArray(strings: any[]) {
    return strings.map((string) => {
      return this.convertToObjectId(string);
    });
  }
  static convertToObjectIdData<T>(data: T, keys: string[]): T {
    const anyData = data as any;
    const dataKeys = Object.keys(anyData);
    for (const dataKey of dataKeys) {
      if (keys.includes(dataKey)) {
        if (Array.isArray(anyData[dataKey])) {
          anyData[dataKey] = MongoDBHelpers.convertToObjectIdArray(
            anyData[dataKey]
          );
        } else {
          anyData[dataKey] = MongoDBHelpers.convertToObjectId(anyData[dataKey]);
        }
      } else {
        if (typeof anyData[dataKey] === 'object') {
          anyData[dataKey] = MongoDBHelpers.convertToObjectIdData(
            anyData[dataKey],
            keys
          );
        }
      }
    }
    return anyData;
  }
}
