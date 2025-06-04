/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import { HomepageCreatedSchema, HomePageRelationsSchema } from '../entity/home-page';
import { BaseSuccessSchemaFactory } from '../cats/cats-core';
import { ErrorResponseModelSchemaFactory, UseCaseErrorResponseFactory } from '../cats/usecase-models';

export const GetHomePageRequestSchema = z.object({
    filter: z.object({
    })
});

export type TGetHomePageRequest = z.infer<typeof GetHomePageRequestSchema>;

export const GetHomePageResponseSchema = BaseSuccessSchemaFactory(HomepageCreatedSchema.merge(HomePageRelationsSchema));

export const ImageErrorSchema = ErrorResponseModelSchemaFactory(
   {
        type: 'ImageError',
        schema: z.object({
            imageURL: z.string(),
        })
    }
);

export type TImageError = z.infer<typeof ImageErrorSchema>;

export const NetworkErrorSchema = ErrorResponseModelSchemaFactory(
    {
        type: 'NetworkError',
        schema: z.object({
            statusCode: z.number(),
        })
    }
);

export const GetHomePageUsecaseErrorResponseSchema = UseCaseErrorResponseFactory({
    ImageError: ImageErrorSchema,
    NetworkError: NetworkErrorSchema,
});

export type TGetHomePageUsecaseErrorResponse = z.infer<typeof GetHomePageUsecaseErrorResponseSchema>;

export const DummyError: TGetHomePageUsecaseErrorResponse = {
    success: false,
    errorType : 'ImageError',
    data: {
        operation: 'get-home-page',
        imageURL: 'https://example.com/image-not-found.jpg',
        statusCode: 404,
        message: 'Image not found',
        context: {
            random: 'random-value',
        },
    }
};

export const HomePageViewModelSchema = z.object({
    mode: z.literal('error'),
    banner: HomePageBannerSchema,
    carousel: z.array(GeneralCardSchema),
    coachingOnDemand: CoachingOnDemandSchema,
    accordion: AccordionListSchema,
});

const presentSuccess = (
    response: z.infer<typeof GetHomePageResponseSchema>,
    currentViewModel: z.infer<typeof HomePageViewModelSchema> | undefined,
    setViewModel: (viewModel: z.infer<typeof HomePageViewModelSchema>) => void
) => {
    
}
