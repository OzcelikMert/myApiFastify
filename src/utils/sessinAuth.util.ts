import {VariableLibrary} from "@library/variable";

const createToken = (userId: string, email: string, password: string, ip: string) : string => {
    return VariableLibrary.hash((userId + "HAaRsLbXC@3P_98" + email + "WwSvQrr86*HK" +  password + "AgGeO26u7n_K&RQ" + ip).toString() + "pH2Q3#rRsLNI98HnVvQ", "sha256")
}

export const SessionAuthUtil = {
    createToken: createToken
};