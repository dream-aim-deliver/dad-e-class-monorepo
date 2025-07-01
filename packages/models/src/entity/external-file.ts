import { z } from 'zod';
import {
    BaseModelDraftSchemaFactory,
    BaseExternalModelSchemaFactory,
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const BaseExternalFileDraftSchema = BaseModelDraftSchemaFactory(
    BaseExternalModelSchemaFactory(z.object({})),
);

export const BaseExternalFileCreatedSchema = BaseModelCreatedSchemaFactory(
    BaseExternalFileDraftSchema,
);

export const BaseExternalFileDeletedSchema = BaseModelDeletedSchemaFactory(
    BaseExternalFileDraftSchema,
);

export const BaseExternalFileIndexSchema = z.object({
    byId: z.number(),
});

export const BaseExternalFileRelationsSchema = z.object({});
