import { z } from 'zod';
import {
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory,
    BaseModelDraftSchemaFactory,
    IDFieldFilterSchema,
} from '../cats';
import { RichText } from './custom-types';
import { PlatformSchema } from '../platform';
import { LanguageSchema } from '../language';

export const PlatformLanguageDraftSchema = BaseModelDraftSchemaFactory(
    z.object({
        impressumContent: z.string(),
        privacyPolicyContent: z.string(),
        termsOfUse: z.string(),
        aboutPageContent: RichText,
    }),
);

export const PlatformLanguageCreatedSchema = BaseModelCreatedSchemaFactory(PlatformLanguageDraftSchema);

export const PlatformLanguageDeletedSchema = BaseModelDeletedSchemaFactory(PlatformLanguageDraftSchema);

export const PlatformLanguageIndexSchema = z.object({
    byId: IDFieldFilterSchema
});

export const PlatformLanguageRelationsSchema = z.object({
    platform: PlatformSchema,
    language: LanguageSchema,
});
export type TPlatformLanguageRelationsSchema = z.infer<typeof PlatformLanguageRelationsSchema>