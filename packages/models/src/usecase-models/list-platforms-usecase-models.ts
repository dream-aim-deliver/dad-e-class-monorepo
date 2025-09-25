import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BasePartialSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
    CommonErrorSchemaMap
} from '@dream-aim-deliver/dad-cats';


export const ListPlatformsRequestSchema = z.object({});
export type TListPlatformsRequest = z.infer<typeof ListPlatformsRequestSchema>;


export const PlatformItemSchema = z.object({
    id: z.number(),
    logoUrl: z.string().nullable(),
    name: z.string(),
    courseCount: z.number(),
});
export type TPlatformItem = z.infer<typeof PlatformItemSchema>;

export const ListPlatformsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    platforms: z.array(PlatformItemSchema)
}));
export type TListPlatformsSuccessResponse = z.infer<typeof ListPlatformsSuccessResponseSchema>;

const ListPlatformsErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListPlatformsErrorResponse = z.infer<typeof ListPlatformsErrorResponseSchema>;

export const ListPlatformsUseCasePartialResponseSchema = BasePartialSchemaFactory(
    PlatformItemSchema,
    CommonErrorSchemaMap
)
export type TListPlatformsUseCasePartialResponse = z.infer<typeof ListPlatformsUseCasePartialResponseSchema>;

export const ListPlatformsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListPlatformsSuccessResponseSchema,
    ListPlatformsErrorResponseSchema,
    ListPlatformsUseCasePartialResponseSchema
]);
export type TListPlatformsUseCaseResponse = z.infer<typeof ListPlatformsUseCaseResponseSchema>;