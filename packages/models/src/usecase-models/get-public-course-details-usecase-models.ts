import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ImageFileSchema } from './common';

export const GetPublicCourseDetailsRequestSchema = z.object({
    courseSlug: z.string(),
});
export type TGetPublicCourseDetailsRequest = z.infer<typeof GetPublicCourseDetailsRequestSchema>;

export const GetPublicCourseDetailsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    courseVersion: z.number(),
    title: z.string(),
    imageFile: ImageFileSchema.nullable(),
    averageRating: z.number(),
    reviewCount: z.number().int(),
    description: z.string(),
    basePrice: z.number().min(0),
    priceIncludingCoachings: z.number().min(0),
    currency: z.string(),
    duration: z.object({
        // Minutes
        video: z.number().int().min(0).nullable(),
        coaching: z.number().int().min(0).nullable(),
        selfStudy: z.number().int().min(0).nullable(),
    }),
    author: z.object({
        username: z.string(),
        name: z.string(),
        surname: z.string(),
        averageRating: z.number(),
        avatarUrl: z.string().nullable()
    }),
    coaches: z.array(z.object({
        name: z.string(),
        avatarUrl: z.string().nullable()
    })),
    requirements: z.array(z.object({
        courseName: z.string(),
        courseSlug: z.string()
    })),
}));
export type TGetPublicCourseDetailsSuccessResponse = z.infer<typeof GetPublicCourseDetailsSuccessResponseSchema>;

const GetPublicCourseDetailsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetPublicCourseDetailsUseCaseErrorResponse = z.infer<typeof GetPublicCourseDetailsUseCaseErrorResponseSchema>;

export const GetPublicCourseDetailsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetPublicCourseDetailsSuccessResponseSchema,
    GetPublicCourseDetailsUseCaseErrorResponseSchema,
]);
export type TGetPublicCourseDetailsUseCaseResponse = z.infer<typeof GetPublicCourseDetailsUseCaseResponseSchema>;