import V from "../library/variable";

const createToken = (userId: string, password: string, ip: string) : string => {
    return V.hash((userId + "HAaRsLbXC@3P_98" + password + "AgGeO26u7n_K&RQ" + ip).toString() + "pH2Q3#rRsLNI98HnVvQ", "sha256")
}

export const SessionAuthUtil = {
    createToken: createToken
};