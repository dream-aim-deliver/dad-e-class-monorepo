import { z } from 'zod';
import {
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory,
    BaseModelDraftSchemaFactory,
} from '../cats';


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
    byId: z.string(),
});

export const LanguageRelationsSchema = z.object({
    // TODO Add any relations if needed
});