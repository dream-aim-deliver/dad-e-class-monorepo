import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { AssessmentComponentSchema } from './common';

export const ListAssessmentComponentsRequestSchema = z.object({
});

export type TListAssessmentComponentsRequest = z.infer<typeof ListAssessmentComponentsRequestSchema>;

export const ListAssessmentComponentsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  components: z.array(AssessmentComponentSchema),
}));

export type TListAssessmentComponentsSuccessResponse = z.infer<typeof ListAssessmentComponentsSuccessResponseSchema>;

const ListAssessmentComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListAssessmentComponentsUseCaseErrorResponse = z.infer<typeof ListAssessmentComponentsUseCaseErrorResponseSchema>;

export const ListAssessmentComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ListAssessmentComponentsSuccessResponseSchema,
  ListAssessmentComponentsUseCaseErrorResponseSchema,
]);

export type TListAssessmentComponentsUseCaseResponse = z.infer<typeof ListAssessmentComponentsUseCaseResponseSchema>;
