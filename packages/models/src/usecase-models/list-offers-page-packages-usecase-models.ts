import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListOffersPagePackagesRequestSchema = DefaultPaginationSchema.extend({});
export type TListOffersPagePackagesRequest = z.infer<
    typeof ListOffersPagePackagesRequestSchema
>;

export const ListOffersPagePackagesSuccessResponseSchema =
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

export type TListOffersPagePackagesSuccessResponse = z.infer<
    typeof ListOffersPagePackagesSuccessResponseSchema
>;

const ListOffersPagePackagesUseCaseErrorResponseSchema =
    BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListOffersPagePackagesUseCaseErrorResponse = z.infer<
    typeof ListOffersPagePackagesUseCaseErrorResponseSchema
>;
export const ListOffersPagePackagesUseCaseResponseSchema =
    BaseStatusDiscriminatedUnionSchemaFactory([
        ListOffersPagePackagesSuccessResponseSchema,
        ListOffersPagePackagesUseCaseErrorResponseSchema,
    ]);
export type TListOffersPagePackagesUseCaseResponse = z.infer<
    typeof ListOffersPagePackagesUseCaseResponseSchema
>;
