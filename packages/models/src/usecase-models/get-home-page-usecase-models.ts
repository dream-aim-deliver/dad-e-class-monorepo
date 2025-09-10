import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetHomePageRequestSchema = z.object({});

export type TGetHomePageRequest = z.infer<typeof GetHomePageRequestSchema>;

export const GetHomePageSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    banner: z.object({
        title: z.string(),
        description: z.string(),
        videoId: z.string().nullable(),
        thumbnailUrl: z.string().nullable(),
    }),
    carousel: z.array(z.object({
        title: z.string(),
        description: z.string(),
        imageUrl: z.string().nullable(),
        buttonText: z.string(),
        buttonUrl: z.string(),
        badge: z.string().optional(),
    })),
    coachingOnDemand: z.object({
        title: z.string(),
        description: z.string(),
        desktopImageUrl: z.string().nullable(),
        tabletImageUrl: z.string().nullable(),
        mobileImageUrl: z.string().nullable(),
    }),
    accordion: z.object({
        title: z.string(),
        showNumbers: z.boolean(),
        items: z.array(z.object({
            title: z.string(),
            content: z.string(),
            position: z.number(),
            iconImageUrl: z.string().nullable(),
        })),
    }),
}));

export type TGetHomePageSuccessResponse = z.infer<typeof GetHomePageSuccessResponseSchema>;


const GetHomePageUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetHomePageUseCaseErrorResponse = z.infer<typeof GetHomePageUseCaseErrorResponseSchema>;


export const GetHomePageUseCaseResponseSchema =  BaseStatusDiscriminatedUnionSchemaFactory([
    GetHomePageSuccessResponseSchema,
    GetHomePageUseCaseErrorResponseSchema,
]);

export type TGetHomePageUseCaseResponse = z.infer<typeof GetHomePageUseCaseResponseSchema>;
