import { z } from 'zod';
import {
    BaseModelDraftSchemaFactory,
    BaseExternalModelSchemaFactory,
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { PlatformLanguageCreatedSchema } from './platform-language';

export const HomePageSchema = BaseModelDraftSchemaFactory(
    BaseExternalModelSchemaFactory(z.object({
    })),
);

export const HomePageCreatedSchema = BaseModelCreatedSchemaFactory(HomePageSchema);

export const HomePageDeletedSchema = BaseModelDeletedSchemaFactory(HomePageSchema);

export const HomePageIndexSchema = z.object({
    byId: z.any(), // TODO: filter
});

export const HomePageRelationsSchema = z.object({
   platformLanguage: PlatformLanguageCreatedSchema,
});
