import { z } from 'zod';
import { BaseDiscriminatedErrorTypeSchemaFactory, BaseErrorDiscriminatedUnionSchemaFactory, BaseStatusDiscriminatedUnionSchemaFactory, BaseSuccessSchemaFactory } from '../cats/cats-core';
import { HomePageDocumentSchema } from '../entity/home-page-documents';

export const GetHomePageRequestSchema = z.object({});

export type TGetHomePageRequest = z.infer<typeof GetHomePageRequestSchema>;

const GetHomePageSuccessResponseSchema = BaseSuccessSchemaFactory(HomePageDocumentSchema);

const NotFound = BaseDiscriminatedErrorTypeSchemaFactory(
   {
        type: 'NotFound',
        schema: z.object({
            trace: z.string().optional(),
        })
    }
);


const GetHomePageUsecaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
    NotFound: NotFound,
});
export type TGetHomePageUsecaseErrorResponse = z.infer<typeof GetHomePageUsecaseErrorResponseSchema>;


export const GetHomePageUsecaseResponseSchema =  BaseStatusDiscriminatedUnionSchemaFactory([
    GetHomePageSuccessResponseSchema,
    GetHomePageUsecaseErrorResponseSchema,
]);

export type TGetHomePageUsecaseResponse = z.infer<typeof GetHomePageUsecaseResponseSchema>;
