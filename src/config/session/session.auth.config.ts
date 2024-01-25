import config from "config";
import mongoose from 'mongoose';
import sessionAuthModel from "../../models/sessionAuth.model";
import crypto from "crypto";

const serverProtocol = config.get("serverProtocol") as string;

export const sessionAuthTTL = 60 * 60;
export const sessionAuthKey = crypto.randomBytes(32);

const sessionAuthConfig = {
    key: sessionAuthKey,
    secret: crypto.randomBytes(32).toString('hex'),
    salt:  "ShMf250ld@__45s1",
    sessionName: "sessionAuth",
    cookieName: "sessionAuthCookie",
    cookie: {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'lax',
        httpOnly: true,
        secure: serverProtocol !== "http",
    },
    /*store: {
        set: async (key: any, value: any) => {
            const session = new sessionAuthModel({ key, value });
            await session.save();
        },
        get: async (key: any) => {
            const session = await sessionAuthModel.findOne({ key }).lean().exec();
            return session ? session : undefined;
        },
        delete: async (key: any) => {
            await sessionAuthModel.deleteOne({ key });
        },
    },*/
    /*storage: {
        db: mongoose.connection.db,
        collection: sessionAuthModel,
    },*/
}

export default sessionAuthConfig;