import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import exp from 'constants';

export const ListAssessmentComponentsRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TListAssessmentComponentsRequest = z.infer<typeof ListAssessmentComponentsRequestSchema>;

const BaseComponent = z.object({
  id: z.string(),
  course_id: z.number(),
  order: z.number(),
  type: z.string(),
});

const OptionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const RichTextSchema = BaseComponent.extend({
  type: z.literal('richText'),
  text: z.string(),
});

const HeadingSchema = BaseComponent.extend({
  type: z.literal('heading'),
  text: z.string(),
  size: z.string(),
});

const TextInputSchema = BaseComponent.extend({
  type: z.literal('textInput'),
  helperText: z.string(),
  required: z.boolean(),
});

const SingleChoiceSchema = BaseComponent.extend({
  type: z.literal('singleChoice'),
  title: z.string(),
  options: z.array(OptionSchema),
  required: z.boolean(),
});

const MultipleChoiceSchema = BaseComponent.extend({
  type: z.literal('multipleChoice'),
  title: z.string(),
  options: z.array(OptionSchema),
  required: z.boolean(),
});

const OneOutOfThreeSchema = BaseComponent.extend({
  type: z.literal('oneOutOfThree'),
  title: z.string(),
  columns: z.array(OptionSchema),
  rows: z.array(OptionSchema),
  required: z.boolean(),
});

const ComponentSchema = z.discriminatedUnion('type', [
  RichTextSchema,
  HeadingSchema,
  TextInputSchema,
  SingleChoiceSchema,
  MultipleChoiceSchema,
  OneOutOfThreeSchema,
]);
export type TLessonComponent = z.infer<typeof ComponentSchema>;

export const ListAssessmentComponentsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  components: z.array(ComponentSchema),
}));

export type TListAssessmentComponentsSuccessResponse = z.infer<typeof ListAssessmentComponentsSuccessResponseSchema>;

const ListAssessmentComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListAssessmentComponentsUseCaseErrorResponse = z.infer<typeof ListAssessmentComponentsUseCaseErrorResponseSchema>;

export const ListAssessmentComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ListAssessmentComponentsSuccessResponseSchema,
  ListAssessmentComponentsUseCaseErrorResponseSchema,
]);

export type TListAssessmentComponentsUseCaseResponse = z.infer<typeof ListAssessmentComponentsUseCaseResponseSchema>;
