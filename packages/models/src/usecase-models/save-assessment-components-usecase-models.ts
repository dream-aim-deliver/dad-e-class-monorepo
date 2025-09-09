import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ListAssessmentComponentsSuccessResponseSchema } from './list-assessment-components-usecase-models';
import { AssessmentComponentRequestSchema } from './common';

export const SaveAssessmentComponentsRequestSchema = z.object({
  components: z.array(AssessmentComponentRequestSchema),
});

export type TSaveAssessmentComponentsRequest = z.infer<typeof SaveAssessmentComponentsRequestSchema>;

export const SaveAssessmentComponentsSuccessResponseSchema = ListAssessmentComponentsSuccessResponseSchema;

export type TSaveAssessmentComponentsSuccessResponse = z.infer<typeof SaveAssessmentComponentsSuccessResponseSchema>;

const SaveAssessmentComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSaveAssessmentComponentsUseCaseErrorResponse = z.infer<typeof SaveAssessmentComponentsUseCaseErrorResponseSchema>;

export const SaveAssessmentComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveAssessmentComponentsSuccessResponseSchema,
  SaveAssessmentComponentsUseCaseErrorResponseSchema,
]);

export type TSaveAssessmentComponentsUseCaseResponse = z.infer<typeof SaveAssessmentComponentsUseCaseResponseSchema>;
