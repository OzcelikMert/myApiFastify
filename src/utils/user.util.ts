import Crypto from "crypto";
import {Config} from "../config";
import V from "../library/variable";

const encodePassword = (password: string) : string => {
    return Crypto.createHash('sha256').update(Config.passwordSalt + password).digest('hex')
}

const createToken = (userId: string, ip: string, time: number) : string => {
    return V.hash((userId + "HAaRsLbXC@3P_98" + ip + time.toString()).toString() + "pH2Q3#rRsLNI98HnVvQ", "sha256")
}

export default {
    encodePassword: encodePassword,
    createToken: createToken
};