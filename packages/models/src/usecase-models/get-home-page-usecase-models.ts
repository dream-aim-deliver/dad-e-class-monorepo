import { z } from 'zod';
import { BaseErrorDiscriminatedUnionSchemaFactory, BaseStatusDiscriminatedUnionSchemaFactory, BaseSuccessSchemaFactory } from '../cats/cats-core';
import { HomePageIndexSchema } from '../entity/home-page';

export const GetHomePageRequestSchema = HomePageIndexSchema.shape.byPlatformLanguageId

export type TGetHomePageRequest = z.infer<typeof GetHomePageRequestSchema>;

const GetHomePageSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    banner: z.object({
        title: z.string(),
        description: z.string(),
        videoId: z.string(),
        thumbnailUrl: z.string(),
    }),
    carousel: z.array(z.object({
        title: z.string(),
        description: z.string(),
        imageUrl: z.string(),
        buttonText: z.string(),
        buttonUrl: z.string(),
        badge: z.string().optional(),
    })),
    coachingOnDemand: z.object({
        title: z.string(),
        description: z.string(),
        desktopImageUrl: z.string(),
        tabletImageUrl: z.string(),
        mobileImageUrl: z.string(),
    }),
    accordion: z.object({
        title: z.string(),
        showNumbers: z.boolean(),
        items: z.array(z.object({
            title: z.string(),
            content: z.string(),
            position: z.number(),
            iconImageUrl: z.string(),
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
