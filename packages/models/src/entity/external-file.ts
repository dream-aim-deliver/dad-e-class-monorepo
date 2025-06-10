import {
    BaseExternalModelSchemaFactory,
    BaseModelDraftSchemaFactory,
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory,
} from '../cats';
import { z } from 'zod';

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
