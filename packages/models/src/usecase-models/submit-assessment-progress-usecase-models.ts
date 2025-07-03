import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

const BaseAnswer = z.object({
  componentId: z.string(),
  type: z.string(),
});

const TextInputAnswer = BaseAnswer.extend({
  type: z.literal('textInput'),
  answer: z.string(),
});

const SingleChoiceAnswer = BaseAnswer.extend({
  type: z.literal('singleChoice'),
  answerId: z.number(),
});

const MultipleChoiceAnswer = BaseAnswer.extend({
  type: z.literal('multipleChoice'),
  answerIds: z.array(z.number()),
});

const OneOutOfThreeAnswer = BaseAnswer.extend({
  type: z.literal('oneOutOfThree'),
  answers: z.record(z.number(), z.number()),
});

const AnswerSchema = z.discriminatedUnion('type', [
  TextInputAnswer,
  SingleChoiceAnswer,
  MultipleChoiceAnswer,
  OneOutOfThreeAnswer,
]);
export type TAnswer = z.infer<typeof AnswerSchema>;

export const SubmitAssessmentProgressRequestSchema = z.object({
  answers: z.array(AnswerSchema),
  courseSlug: z.string(),
});

export type TSubmitAssessmentProgressRequest = z.infer<typeof SubmitAssessmentProgressRequestSchema>;

export const SubmitAssessmentProgressSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({}));

export type TSubmitAssessmentProgressSuccessResponse = z.infer<typeof SubmitAssessmentProgressSuccessResponseSchema>;

const SubmitAssessmentProgressUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  DuplicateError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'DuplicateError',
    schema: z.object({
        trace: z.string().optional(),
    }),
  }),
});
export type TSubmitAssessmentProgressUseCaseErrorResponse = z.infer<typeof SubmitAssessmentProgressUseCaseErrorResponseSchema>;

export const SubmitAssessmentProgressUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SubmitAssessmentProgressSuccessResponseSchema,
  SubmitAssessmentProgressUseCaseErrorResponseSchema,
]);

export type TSubmitAssessmentProgressUseCaseResponse = z.infer<typeof SubmitAssessmentProgressUseCaseResponseSchema>;
