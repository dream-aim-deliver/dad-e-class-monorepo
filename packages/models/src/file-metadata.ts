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


export const FileMetadataSchema = z.object({
    name: z.string(),
    mimeType: z.string(), // TBD: should we add a validator?
    size: z.number(),
    checksum: z.string(),
    lfn: z.string(),
    status: FileStatusEnumSchema,
    thumbnailUrl: z.string().optional(),
    externalProviders: z.array(ExternalProviderSchema),
    category: FileCategoryEnumSchema,
});

export type TFileMetadata = z.infer<
    typeof FileMetadataSchema
>;


export const FileUploadRequestSchema = z.object({
    name: z.string(),
    buffer: z.instanceof(Buffer),
});

export type TFileUploadRequest = z.infer<
    typeof FileUploadRequestSchema>;
