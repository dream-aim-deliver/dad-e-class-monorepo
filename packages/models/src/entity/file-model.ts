import { z } from 'zod';
import {
    BaseModelDraftSchemaFactory,
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { BaseExternalFileCreatedSchema } from './external-file';

// TODO: move to the view model, to be mapped from mime type in the usecase
//const FileCategoryEnumSchema = z.enum([
//'image',
//'video',
//'generic',
//'document',
//]);

const FileStatusEnumSchema = z.enum(['available', 'processing', 'unavailable']);

export const FileMetadataDraftSchema = BaseModelDraftSchemaFactory(
    z.object({
        name: z.string(),
        mimeType: z.string(), // TODO: add a validator
        size: z.number(),
        checksum: z.string(),
        lfn: z.string(),
        status: FileStatusEnumSchema,
    }),
);

export const FileMetadataCreatedSchema = BaseModelCreatedSchemaFactory(
    FileMetadataDraftSchema,
);

export const FileMetadataDeletedSchema = BaseModelDeletedSchemaFactory(
    FileMetadataDraftSchema,
);

export const FileMetadataIndexSchema = z.object({
    byId: z.any(),
    byExternalId: z.any().optional(),
});

export const FileMetadataRelationsSchema = z.object({
    thumbnail: FileMetadataCreatedSchema.optional(),
    externalProvider: z.array(BaseExternalFileCreatedSchema).optional(),
});
