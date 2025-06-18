import { z } from 'zod';
import { BaseExternalModelSchemaFactory, BaseModelCreatedSchemaFactory, BaseModelDeletedSchemaFactory, BaseModelDraftSchemaFactory } from '../cats/cats-core';
import { PlatformLanguageCreatedSchema } from './platform-language';
import { IDFieldFilterSchema, RelationFilterSchemaFactory } from '../cats';

export const HomePageSchema = BaseModelDraftSchemaFactory(
    BaseExternalModelSchemaFactory(z.object({
    })),
);

export const HomePageCreatedSchema = BaseModelCreatedSchemaFactory(HomePageSchema);

export const HomePageDeletedSchema = BaseModelDeletedSchemaFactory(HomePageSchema);

export const HomePageRelationsSchema = z.object({
   platformLanguage: PlatformLanguageCreatedSchema,
});

export const HomePageIndexSchema = z.object({
    byId: IDFieldFilterSchema.optional(),
    byPlatformLanguageId: RelationFilterSchemaFactory(
        HomePageRelationsSchema,
        'platformLanguage',
        PlatformLanguageCreatedSchema,
        IDFieldFilterSchema
    ).optional(),
});

