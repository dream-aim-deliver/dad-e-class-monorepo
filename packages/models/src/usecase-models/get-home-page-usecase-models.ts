import { z } from 'zod';
import { HomepageCreatedSchema, HomePageRelationsSchema } from '../entity/home-page';
import { BaseDiscriminatedErrorTypeSchemaFactory as BaseDiscriminatedErrorDataSchemaFactory, BaseErrorDiscriminatedUnionSchemaFactory, BaseStatusDiscriminatedUnionSchemaFactory, BaseSuccessSchemaFactory } from '../cats/cats-core';

export const GetHomePageRequestSchema = z.object({
    filter: z.object({
    })
});

export type TGetHomePageRequest = z.infer<typeof GetHomePageRequestSchema>;

const GetHomePageSuccessResponseSchema = BaseSuccessSchemaFactory(HomepageCreatedSchema.merge(HomePageRelationsSchema));

const CMSError = BaseDiscriminatedErrorDataSchemaFactory(
   {
        type: 'CMSError',
        schema: z.object({
            trace: z.string().optional(),
        })
    }
);


const GetHomePageUsecaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
    CMSError: CMSError,
});
export type TGetHomePageUsecaseErrorResponse = z.infer<typeof GetHomePageUsecaseErrorResponseSchema>;


export const GetHomePageUsecaseResponseSchema =  BaseStatusDiscriminatedUnionSchemaFactory([
    GetHomePageSuccessResponseSchema,
    GetHomePageUsecaseErrorResponseSchema,
]);

export type TGetHomePageUsecaseResponse = z.infer<typeof GetHomePageUsecaseResponseSchema>;
