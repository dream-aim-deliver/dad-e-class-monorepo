import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetOffersPageOutlineRequestSchema = z.object({});
export type TGetOffersPageOutlineRequest = z.infer<typeof GetOffersPageOutlineRequestSchema>;

export const GetOffersPageOutlineSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        badge: z.string().nullable(),
        imageUrl: z.string().nullable(),
        buttonText: z.string(),
        buttonUrl: z.string(),
    })),
}));

export type TGetOffersPageOutlineSuccessResponse = z.infer<typeof GetOffersPageOutlineSuccessResponseSchema>;

const GetOffersPageOutlineUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetOffersPageOutlineUseCaseErrorResponse = z.infer<typeof GetOffersPageOutlineUseCaseErrorResponseSchema>;
export const GetOffersPageOutlineUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetOffersPageOutlineSuccessResponseSchema,
    GetOffersPageOutlineUseCaseErrorResponseSchema,
]);
export type TGetOffersPageOutlineUseCaseResponse = z.infer<typeof GetOffersPageOutlineUseCaseResponseSchema>;
