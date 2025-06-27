import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListCoachingOfferingsRequestSchema = z.object({});
export type TListCoachingOfferingsRequest = z.infer<typeof ListCoachingOfferingsRequestSchema>;

export const ListCoachingOfferingsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    offerings: z.array(z.object({
        id: z.string().or(z.number()),
        // TODO: decide whether coaching offerings require a slug
        name: z.string(),
        duration: z.number().int().positive(), // minutes
        price: z.number(),
        currency: z.string(),
        description: z.string(),
    }))
}));

export type TListCoachingOfferingsSuccessResponse = z.infer<typeof ListCoachingOfferingsSuccessResponseSchema>;

const ListCoachingOfferingsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCoachingOfferingsUseCaseErrorResponse = z.infer<typeof ListCoachingOfferingsUseCaseErrorResponseSchema>;
export const ListCoachingOfferingsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCoachingOfferingsSuccessResponseSchema,
    ListCoachingOfferingsUseCaseErrorResponseSchema,
]);
export type TListCoachingOfferingsUseCaseResponse = z.infer<typeof ListCoachingOfferingsUseCaseResponseSchema>;
