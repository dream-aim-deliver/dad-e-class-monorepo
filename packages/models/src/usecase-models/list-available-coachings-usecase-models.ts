import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListAvailableCoachingsRequestSchema = z.object({});
export type TListAvailableCoachingsRequest = z.infer<typeof ListAvailableCoachingsRequestSchema>;

export const ListAvailableCoachingsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    offerings: z.object({
        id: z.string().or(z.number()),
        name: z.string(),
        duration: z.number().int().positive(), // minutes
        boughtCoachingIds: z.array(z.string().or(z.number())),
    }).array()
}));

export type TListAvailableCoachingsSuccessResponse = z.infer<typeof ListAvailableCoachingsSuccessResponseSchema>;

const ListAvailableCoachingsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListAvailableCoachingsUseCaseErrorResponse = z.infer<typeof ListAvailableCoachingsUseCaseErrorResponseSchema>;
export const ListAvailableCoachingsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListAvailableCoachingsSuccessResponseSchema,
    ListAvailableCoachingsUseCaseErrorResponseSchema,
]);
export type TListAvailableCoachingsUseCaseResponse = z.infer<typeof ListAvailableCoachingsUseCaseResponseSchema>;
