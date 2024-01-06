import {object, string, array, number, ZodType} from 'zod';
import {ErrorCodes} from "../library/api";
import {SettingGetParamDocument} from "../types/services/setting.service";

const getSchema = object({
    query: object({
        langId: string(),
        projection: string()
    }) as ZodType<SettingGetParamDocument>
});

const putGeneralSchema = object({
    body: object({
        defaultLangId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
        icon: string(),
        logo: string(),
        logoTwo: string(),
        head: string(),
        script: string(),
        contact: object({
            email: string(),
            phone: string(),
            address: string(),
            addressMap: string(),
            facebook: string(),
            instagram: string(),
            twitter: string(),
            linkedin: string(),
            google: string(),
        }),
    })
});

const putSeoSchema = object({
    body: object({
        seoContents: object({
            langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            title: string(),
            content: string(),
            tags: array(string().min(1, { message: ErrorCodes.emptyValue.toString() })).default([])
        }),
    })
});

const putContactFormSchema = object({
    body: object({
        contactForms: array(object({
            _id: string(),
            name: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            key: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            outGoingEmail: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            email: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            password: string(),
            outGoingServer: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            inComingServer: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            port: number().min(1, { message: ErrorCodes.emptyValue.toString() })
        })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

const putSocialMediaSchema = object({
    body: object({
        socialMedia: array(object({
            _id: string(),
            elementId: string().default(""),
            title: string().default(""),
            url: string().default(""),
        })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

const putStaticLanguageSchema = object({
    body: object({
        staticLanguages: array(object({
            _id: string(),
            langKey: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
            title: string().default(""),
            contents: object({
                _id: string(),
                langId: string().min(1, { message: ErrorCodes.emptyValue.toString() }),
                content: string().default(""),
            })
        })).min(1, { message: ErrorCodes.emptyValue.toString() }),
    })
});

const putECommerceSchema = object({
    body: object({
        eCommerce: object({
            currencyId: number().min(1, { message: ErrorCodes.emptyValue.toString() }),
        }),
    })
});

export default {
    get: getSchema,
    putGeneral: putGeneralSchema,
    putSeo: putSeoSchema,
    putContactForm: putContactFormSchema,
    putSocialMedia: putSocialMediaSchema,
    putStaticLanguage: putStaticLanguageSchema,
    putECommerce: putECommerceSchema,
};