import { z } from 'zod';
import {
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory,
    BaseModelDraftSchemaFactory,
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
    byLanguge: z.any(), // TODO: filter
    byPlatform: z.any() // TODO: filter
});

export const PlatformLanguageRelationsSchema = z.object({
    platform: PlatformSchema,
    language: LanguageSchema,
});
