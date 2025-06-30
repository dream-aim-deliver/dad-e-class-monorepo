import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetOffersPageCarouselRequestSchema = z.object({});
export type TGetOffersPageCarouselRequest = z.infer<typeof GetOffersPageCarouselRequestSchema>;

export const GetOffersPageCarouselSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        badge: z.string().nullable(),
        imageUrl: z.string().nullable(),
        buttonText: z.string(),
        buttonUrl: z.string(),
    }))
}));

export type TGetOffersPageCarouselSuccessResponse = z.infer<typeof GetOffersPageCarouselSuccessResponseSchema>;

const GetOffersPageCarouselUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetOffersPageCarouselUseCaseErrorResponse = z.infer<typeof GetOffersPageCarouselUseCaseErrorResponseSchema>;
export const GetOffersPageCarouselUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetOffersPageCarouselSuccessResponseSchema,
    GetOffersPageCarouselUseCaseErrorResponseSchema,
]);
export type TGetOffersPageCarouselUseCaseResponse = z.infer<typeof GetOffersPageCarouselUseCaseResponseSchema>;
