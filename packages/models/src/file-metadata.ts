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

export const FileMetadataBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    status: FileStatusEnumSchema,
    category: FileCategoryEnumSchema,
});

export const FileMetadataVideoSchema = FileMetadataBaseSchema.extend({
    category: z.literal('video'),
    url: z.string().url(),
    videoId: z.string().nullable(),
    thumbnailUrl: z.string().url().nullable(),
});

export const FileMetadataImageSchema = FileMetadataBaseSchema.extend({
    category: z.literal('image'),
    url: z.string().url(),
    thumbnailUrl: z.string().url().nullable(),
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

export type TFileMetadataImage = z.infer<typeof FileMetadataImageSchema>;
export type TFileMetadataVideo = z.infer<typeof FileMetadataVideoSchema>;

export const FileUploadRequestSchema = z.object({
    id: z.string(),
    name: z.string(),
    file: z.instanceof(File),
});

/**
 * TFileUploadRequest
 * Represents the request for uploading a file.
 * It includes the file ID, name, and the actual file object.
 * The ID is meant to be used to identify the file in memory before it is stored, e.g., to handle cancellation or progress tracking.
 * 
 * @typedef {Object} TFileUploadRequest
 * @property {string} id - The unique identifier for the file upload request.
 * @property {string} name - The name of the file being uploaded.
 * @property {File} file - The actual file object to be uploaded.
 */
export type TFileUploadRequest = z.infer<
    typeof FileUploadRequestSchema>;
