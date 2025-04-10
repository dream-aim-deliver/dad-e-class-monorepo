import { z } from 'zod';


export const GetClientDataForUploadSuccessDTO = z.object({
    success: z.literal(true),
    data: z.object({
        credentials: z.string(),
    }),
});
export const GetClientDataForUploadErrorDTO = z.object({
    success: z.literal(false),
    data: z.object({
        name: z.string(),
        code: z.number(),
        message: z.string(),
        context: z.object({}),
    }),
});

export const GetClientDataForUploadDTOSchema = z.discriminatedUnion("success", [
    GetClientDataForUploadSuccessDTO,
    GetClientDataForUploadErrorDTO,
]);
export type TGetClientDataForUploadDTO = z.infer<typeof GetClientDataForUploadDTOSchema>;

export const GetClientDataForDownloadSuccessDTO = z.object({
    success: z.literal(true),
    data: z.object({
        credentials: z.string(),
    }),
});
export const GetClientDataForDownloadErrorDTO = z.object({
    success: z.literal(false),
    data: z.object({
        name: z.string(),
        code: z.number(),
        message: z.string(),
        context: z.object({}),
    }),
});
export const GetClientDataForDownloadDTOSchema = z.discriminatedUnion("success", [
    GetClientDataForDownloadSuccessDTO,
    GetClientDataForDownloadErrorDTO,
]);
export type TGetCliendDataForDownloadDTO = z.infer<typeof GetClientDataForDownloadDTOSchema>;

export const FileExistsInMinioSuccessDTO = z.object({
    success: z.literal(true),
    data: z.object({
        exists: z.boolean(),
    }),
});
export const FileExistsInMinioErrorDTO = z.object({
    success: z.literal(false),
    data: z.object({
        name: z.string(),
        code: z.number(),
        message: z.string(),
        context: z.object({}),
    }),
});

export const FileExistsInMinioDTOSchema = z.discriminatedUnion("success", [
    FileExistsInMinioSuccessDTO,
    FileExistsInMinioErrorDTO,
]);
export type TFileExistsInMinioDTO = z.infer<typeof FileExistsInMinioDTOSchema>;