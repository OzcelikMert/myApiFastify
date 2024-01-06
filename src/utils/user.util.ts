import Crypto from "crypto";
import {Config} from "../config";
import V from "../library/variable";

export default {
    encodePassword(password: string) : string {
        return Crypto.createHash('sha256').update(Config.passwordSalt + password).digest('hex')
    },
    createToken(userId: string, ip: string, time: number) : string {
        return V.hash((userId + ip + time.toString()).toString(), "sha256")
    }
};