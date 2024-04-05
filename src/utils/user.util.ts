import Crypto from "crypto";
import {Config} from "@configs/index";

const encodePassword = (password: string) : string => {
    return Crypto.createHash('sha256').update(Config.passwordSalt + password).digest('hex')
}

export const UserUtil = {
    encodePassword: encodePassword
};