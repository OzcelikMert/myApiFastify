import {z, ZodNativeEnum, ZodTypeAny} from "zod";

export enum ZodUtilVariableType {
    Number = 1,
    String
}

const convertToNumber = <T extends ZodTypeAny>(schema: T) => {
    return z.preprocess((a) => {
        if (typeof a === 'string') {
            return Number(a)
        }
        return a;
    }, schema);
}

export const ZodUtil = {
    convertToNumber: convertToNumber
}