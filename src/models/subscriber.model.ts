import * as mongoose from "mongoose";
import {ISubscriberModel} from "../types/models/subscriber.model";

const schema = new mongoose.Schema<ISubscriberModel>(
    {
            email: {type: String, required: true},
    },
    {timestamps: true}
)

export default mongoose.model<ISubscriberModel, mongoose.Model<ISubscriberModel>>("subscribers", schema)