import { z } from 'zod';
import { BaseModelCreatedSchemaFactory, BaseModelDeletedSchemaFactory, BaseModelDraftSchemaFactory } from '../cats/cats-core';

export const HomePageMetadataSchema = z.object({
});

export const HomePageDraftSchema = BaseModelDraftSchemaFactory(z.object({
    title: z.string(),
    description: z.string(),
    videoId: z.string(),
    thumbnailUrl: z.string(),
}));

export const HomepageCreatedSchema = BaseModelCreatedSchemaFactory(HomePageDraftSchema);


export const HomePageDeletedSchema = BaseModelDeletedSchemaFactory(HomePageDraftSchema);

export const HomePageIndexSchema = z.object({
    by_id: z.number().or(z.string()),
});

export const HomePageRelationsSchema = z.object({
    // externalProvider: BaseExternalProviderSchema
});

