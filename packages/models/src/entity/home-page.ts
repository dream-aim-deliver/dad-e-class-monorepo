import { z } from 'zod';
import { BaseExternalModelSchemaFactory, BaseModelCreatedSchemaFactory, BaseModelDeletedSchemaFactory, BaseModelDraftSchemaFactory } from '../cats/cats-core';
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
