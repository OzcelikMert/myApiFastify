import config from "config";
import mongoose from 'mongoose';
import sessionAuthModel from "../../models/sessionAuth.model";
import crypto from "crypto";

const serverProtocol = config.get("serverProtocol") as string;

export const sessionAuthTTL = 60 * 60;
export const sessionAuthKey = "ShMf250ld@__45slS";

const sessionConfig = {
    key: sessionAuthKey,
    secret: 'ShMf250ld@__45slS32_15@QeeR18',
    sessionName: "auth",
    cookieName: "sessionAuth",
    cookie: {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'Lax',
        httpOnly: true,
        secure: serverProtocol !== "http",
    },
    storage: {
        db: mongoose.connection.db,
        collection: sessionAuthModel,
    },
}

export default {sessionConfig};