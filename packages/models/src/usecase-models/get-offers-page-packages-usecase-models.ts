import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetOffersPagePackagesRequestSchema = z.object({});
export type TGetOffersPagePackagesRequest = z.infer<
    typeof GetOffersPagePackagesRequestSchema
>;

export const GetOffersPagePackagesSuccessResponseSchema =
    BaseSuccessSchemaFactory(
        z.object({
            packages: z.array(
                z.object({
                    id: z.string().or(z.number()),
                    title: z.string(),
                    slug: z.string(),
                    description: z.string(),
                    imageUrl: z.string().nullable(),
                    courseCount: z.number(),
                    duration: z.number(),
                    pricing: z.object({
                        allCourses: z.number(),
                        actual: z.number(),
                        currency: z.string(),
                    }),
                }),
            ),
        }),
    );

export type TGetOffersPagePackagesSuccessResponse = z.infer<
    typeof GetOffersPagePackagesSuccessResponseSchema
>;

const GetOffersPagePackagesUseCaseErrorResponseSchema =
    BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetOffersPagePackagesUseCaseErrorResponse = z.infer<
    typeof GetOffersPagePackagesUseCaseErrorResponseSchema
>;
export const GetOffersPagePackagesUseCaseResponseSchema =
    BaseStatusDiscriminatedUnionSchemaFactory([
        GetOffersPagePackagesSuccessResponseSchema,
        GetOffersPagePackagesUseCaseErrorResponseSchema,
    ]);
export type TGetOffersPagePackagesUseCaseResponse = z.infer<
    typeof GetOffersPagePackagesUseCaseResponseSchema
>;
