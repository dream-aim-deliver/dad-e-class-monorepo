import { z } from 'zod';
import {
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory,
    BaseModelDraftSchemaFactory,
    IDFieldFilterSchema,
    StringEqFilterFactory,
} from '../cats';
import { PlatformLanguageCreatedSchema } from './platform-language';



export const LanguageDraftSchema = BaseModelDraftSchemaFactory(
    z.object({
        languageCode: z.string(),
        language: z.string(),
    }),
);

export const LanguageCreatedSchema = BaseModelCreatedSchemaFactory(
    LanguageDraftSchema,
);

export const LanguageDeletedSchema = BaseModelDeletedSchemaFactory(
    LanguageDraftSchema,
);
export const LanguageIndexSchema = z.object({
    byId: IDFieldFilterSchema,
    byLanguageCode: StringEqFilterFactory<z.infer<typeof LanguageDraftSchema>, "languageCode">('languageCode'),
});

export const LanguageRelationsSchema = z.object({
    platformLanguage: PlatformLanguageCreatedSchema
});