/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import { HomepageCreatedSchema, HomePageRelationsSchema } from '../entity/home-page';
import { BaseDiscriminatedErrorTypeSchemaFactory, BaseErrorDiscriminatedUnionSchemaFactory, BasePartialSchemaFactory, BaseSuccessSchemaFactory } from '../cats/cats-core';

export const GetHomePageRequestSchema = z.object({
    filter: z.object({
    })
});

export type TGetHomePageRequest = z.infer<typeof GetHomePageRequestSchema>;

export const GetHomePageSuccessResponseSchema = BaseSuccessSchemaFactory(HomepageCreatedSchema.merge(HomePageRelationsSchema));

export const CMSError = BaseDiscriminatedErrorTypeSchemaFactory(
   {
        type: 'CMSError',
        schema: z.object({
            trace: z.string().optional(),
        })
    }
);


export const GetHomePageUsecaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
    CMSError: CMSError,
});

export type TGetHomePageUsecaseErrorResponse = z.infer<typeof GetHomePageUsecaseErrorResponseSchema>;

export const DummyError: TGetHomePageUsecaseErrorResponse = {
    success: false,
    errorType : 'CMSError',
    data: {
        operation: 'get-home-page',
        message: 'Image not found',
        trace: 'trace-id-12345',
        context: {
            random: 'random-value',
        },
    }
};

// export const HomePageViewModelSchema = z.object({
//     mode: z.literal('error'),
//     banner: HomePageBannerSchema,
//     carousel: z.array(GeneralCardSchema),
//     coachingOnDemand: CoachingOnDemandSchema,
//     accordion: AccordionListSchema,
// });

// const presentSuccess = (
//     response: z.infer<typeof GetHomePageResponseSchema>,
//     currentViewModel: z.infer<typeof HomePageViewModelSchema> | undefined,
//     setViewModel: (viewModel: z.infer<typeof HomePageViewModelSchema>) => void
// ) => {
    
// }
