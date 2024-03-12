import {z, ZodNativeEnum} from "zod";

export enum ZodUtilVariableType {
    Number = 1,
    String
}

const enumValidator = <T extends z.EnumLike>(enumObj: T, type?: ZodUtilVariableType) => {
    return z.custom((value: any) => {
        if(type){
            switch (type) {
                case ZodUtilVariableType.Number: value = Number(value); break;
            }
        }
        return z.nativeEnum(enumObj).safeParse(value);
    }) as ZodNativeEnum<T>;
}

export const ZodUtil = {
    enumValidator: enumValidator
}