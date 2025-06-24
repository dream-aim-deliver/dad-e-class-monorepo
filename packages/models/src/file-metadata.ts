import { z } from 'zod';


const FileCategoryEnumSchema = z.enum([
    'image',
    'video',
    'generic',
    'document',
]);

export type TFileCategoryEnum = z.infer<typeof FileCategoryEnumSchema>;

const FileStatusEnumSchema = z.enum(['available', 'processing', 'unavailable']);

export type TFileStatusEnum = z.infer<typeof FileStatusEnumSchema>;


export const ExternalProviderSchema = z.object({
    name: z.string(),
    externalId: z.string(),
});


export const FileMetadataBaseSchema = z.object({
    name: z.string(),
    mimeType: z.string(), // TBD: should we add a validator?
    size: z.number(),
    checksum: z.string(),
    lfn: z.string(),
    status: FileStatusEnumSchema,
    category: FileCategoryEnumSchema,
});

export const FileMetadataVideoSchema = FileMetadataBaseSchema.extend({
    category: z.literal('video'),
    videoId: z.number(),
    thumbnailUrl: z.string().url(),
});

export const FileMetadataImageSchema = FileMetadataBaseSchema.extend({
    category: z.literal('image'),
    url: z.string().url(),
    thumbnailUrl: z.string().url(),
});

export const FileMetadataDocumentSchema = FileMetadataBaseSchema.extend({
    category: z.literal('document'),
    url: z.string().url(),
});

export const FileMetadataGenericSchema = FileMetadataBaseSchema.extend({
    category: z.literal('generic'),
    url: z.string().url(),
});

export const FileMetadataSchema = z.discriminatedUnion('category', [
    FileMetadataVideoSchema,
    FileMetadataImageSchema,
    FileMetadataDocumentSchema,
    FileMetadataGenericSchema,
]);

export type TFileMetadata = z.infer<
    typeof FileMetadataSchema
>;


export const FileUploadRequestSchema = z.object({
    name: z.string(),
    buffer: z.instanceof(Buffer),
});

export type TFileUploadRequest = z.infer<
    typeof FileUploadRequestSchema>;
