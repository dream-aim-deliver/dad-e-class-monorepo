import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { RichText } from '../entity';

export const GetPlatformRequestSchema = z.object({});
export type TGetPlatformRequest = z.infer<typeof GetPlatformRequestSchema>;

const GetPlatformSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    backgroundImageUrl: z.string(),
    footerContent: RichText,
    id: z.string().or(z.number()),
    logoUrl: z.string(),
    name: z.string(),
}));

export type TGetPlatformSuccessResponse = z.infer<typeof GetPlatformSuccessResponseSchema>;

const GetPlatformUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetPlatformUseCaseErrorResponse = z.infer<typeof GetPlatformUseCaseErrorResponseSchema>;
export const GetPlatformUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetPlatformSuccessResponseSchema,
    GetPlatformUseCaseErrorResponseSchema,
]);
export type TGetPlatformUseCaseResponse = z.infer<typeof GetPlatformUseCaseResponseSchema>;
