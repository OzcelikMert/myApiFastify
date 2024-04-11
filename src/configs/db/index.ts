import mongoose, {ConnectOptions} from "mongoose";
import config from "config";

function dbConnect() {
    const protocol = config.get<string>("dbProtocol");
    const name = config.get<string>("dbName");
    const host = config.get<string>("dbHost");
    const hostParams = config.get<string>("dbHostParams");
    const port = config.get<number>("dbPort");
    const user = config.get<string>("dbUser");
    const password = config.get<string>("dbPassword");

    mongoose.set("strictQuery", false);
    return mongoose.connect(`${protocol}://${host}${port ? `:${port}` : ""}${hostParams ? `${hostParams}` : ""}`, {
        noDelay: true,
        autoCreate: true,
        autoIndex: true,
        dbName: name,
        user: user ?? undefined,
        pass: password ?? undefined
    } as ConnectOptions)
}

export default dbConnect;