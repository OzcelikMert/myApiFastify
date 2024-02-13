import {array, number, object, string, z} from 'zod';
import {SettingProjectionKeys} from "../constants/settingProjections";
import {CurrencyId} from "../constants/currencyTypes";

const getSchema = object({
    query: object({
        langId: string().optional(),
        projection: z.nativeEnum(SettingProjectionKeys).optional()
    })
});

const putGeneralSchema = object({
    body: object({
        defaultLangId: string().min(1),
        icon: string().optional(),
        logo: string().optional(),
        logoTwo: string().optional(),
        head: string().optional(),
        script: string().optional(),
        contact: object({
            email: string().optional(),
            phone: string().optional(),
            address: string().optional(),
            addressMap: string().optional(),
            facebook: string().optional(),
            instagram: string().optional(),
            twitter: string().optional(),
            linkedin: string().optional(),
            google: string().optional(),
        }),
    })
});

const putSeoSchema = object({
    body: object({
        seoContents: object({
            langId: string().min(1),
            title: string().optional(),
            content: string().optional(),
            tags: array(string().min(1)).default([])
        }),
    })
});

const putContactFormSchema = object({
    body: object({
        contactForms: array(object({
            _id: string().optional(),
            name: string().min(1),
            key: string().min(1),
            outGoingEmail: string().min(1),
            email: string().min(1),
            password: string().optional(),
            outGoingServer: string().min(1),
            inComingServer: string().min(1),
            port: number().min(1)
        })).min(1),
    })
});

const putSocialMediaSchema = object({
    body: object({
        socialMedia: array(object({
            _id: string().optional(),
            elementId: string().default(""),
            title: string().default(""),
            url: string().default(""),
        })).min(1),
    })
});

const putStaticLanguageSchema = object({
    body: object({
        staticLanguages: array(object({
            _id: string().optional(),
            langKey: string().min(1),
            title: string().default(""),
            contents: object({
                _id: string().optional(),
                langId: string().min(1),
                content: string().default(""),
            })
        })).min(1),
    })
});

const putECommerceSchema = object({
    body: object({
        eCommerce: object({
            currencyId: z.nativeEnum(CurrencyId),
        }),
    })
});

export type ISettingGetSchema = z.infer<typeof getSchema>;
export type ISettingPutGeneralSchema = z.infer<typeof putGeneralSchema>;
export type ISettingPutSEOSchema = z.infer<typeof putSeoSchema>;
export type ISettingPutContactFormSchema = z.infer<typeof putContactFormSchema>;
export type ISettingPutSocialMediaSchema = z.infer<typeof putSocialMediaSchema>;
export type ISettingPutStaticLanguageSchema = z.infer<typeof putStaticLanguageSchema>;
export type ISettingPutECommerceSchema = z.infer<typeof putECommerceSchema>;

export const SettingSchema = {
    get: getSchema,
    putGeneral: putGeneralSchema,
    putSeo: putSeoSchema,
    putContactForm: putContactFormSchema,
    putSocialMedia: putSocialMediaSchema,
    putStaticLanguage: putStaticLanguageSchema,
    putECommerce: putECommerceSchema,
};