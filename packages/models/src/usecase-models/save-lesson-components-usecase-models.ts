import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from './list-lesson-components-usecase-models';

const BaseComponentSchema = z.object({
  id: z.string().optional(), // Doesn't exist if the component is new
  order: z.number().int(),
});

const RichTextComponentSchema = BaseComponentSchema.extend({
  type: z.literal('richText'),
  text: z.string(),
  includeInMaterials: z.boolean(),
});

const HeadingComponentSchema = BaseComponentSchema.extend({
  type: z.literal('heading'),
  text: z.string(),
  size: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
});

const SingleChoiceComponentSchema = BaseComponentSchema.extend({
  type: z.literal('singleChoice'),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
  })),
  required: z.boolean(),
});

const MultipleChoiceComponentSchema = BaseComponentSchema.extend({
  type: z.literal('multipleChoice'),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
  })),
  required: z.boolean(),
});

const TextInputComponentSchema = BaseComponentSchema.extend({
  type: z.literal('textInput'),
  helperText: z.string(),
  required: z.boolean(),
});

const OneOutOfThreeComponentSchema = BaseComponentSchema.extend({
  type: z.literal('oneOutOfThree'),
  title: z.string(),
  columns: z.array(z.object({
    name: z.string(),
  })),
  rows: z.array(z.object({
    name: z.string(),
  })),
  required: z.boolean(),
});

const VideoComponentSchema = BaseComponentSchema.extend({
  type: z.literal('video'),
  videoFileId: z.string(),
});

const ImageComponentSchema = BaseComponentSchema.extend({
  type: z.literal('image'),
  imageFileId: z.string(),
});

const ImageCarouselComponentSchema = BaseComponentSchema.extend({
  type: z.literal('imageCarousel'),
  imageFileIds: z.array(z.string()),
});

const LinksComponentSchema = BaseComponentSchema.extend({
  type: z.literal('links'),
  links: z.array(z.object({
    title: z.string(),
    url: z.string(),
    iconFileId: z.string().nullable(),
  })),
});

const DownloadFilesComponentSchema = BaseComponentSchema.extend({
  type: z.literal('downloadFiles'),
  fileIds: z.array(z.string()),
});

const UploadFilesComponentSchema = BaseComponentSchema.extend({
  type: z.literal('uploadFiles'),
  description: z.string(),
});

const QuizTypeOneComponentSchema = BaseComponentSchema.extend({
  type: z.literal('quizTypeOne'),
  title: z.string(),
  description: z.string(),
  imageFileId: z.string(),
  options: z.array(z.object({
    name: z.string(),
    isCorrect: z.boolean(),
  })),
});

const QuizTypeTwoComponentSchema = BaseComponentSchema.extend({
  type: z.literal('quizTypeTwo'),
  title: z.string(),
  description: z.string(),
  imageFileId: z.string(),
  groups: z.array(z.object({
    title: z.string(),
    options: z.array(z.object({
      name: z.string(),
      isCorrect: z.boolean(),
    })),
  })),
});

const QuizTypeThreeComponentSchema = BaseComponentSchema.extend({
  type: z.literal('quizTypeThree'),
  title: z.string(),
  description: z.string(),
  options: z.array(z.object({
    imageFileId: z.string(),
    description: z.string(),
    isCorrect: z.boolean(),
  })),
});

const QuizTypeFourComponentSchema = BaseComponentSchema.extend({
  type: z.literal('quizTypeFour'),
  title: z.string(),
  description: z.string(),
  options: z.array(z.object({
    imageFileId: z.string(),
    description: z.string(),
  })),
});

const CoachingSessionComponentSchema = BaseComponentSchema.extend({
  type: z.literal('coachingSession'),
  courseCoachingOfferingId: z.number().int(),
  name: z.string(),
  duration: z.number().int(),
});

const AssignmentComponentSchema = BaseComponentSchema.extend({
  type: z.literal('assignment'),
  title: z.string(),
  description: z.string(),
});

const ComponentSchema = z.discriminatedUnion('type', [
  RichTextComponentSchema,
  HeadingComponentSchema,
  SingleChoiceComponentSchema,
  MultipleChoiceComponentSchema,
  TextInputComponentSchema,
  OneOutOfThreeComponentSchema,
  VideoComponentSchema,
  ImageComponentSchema,
  ImageCarouselComponentSchema,
  LinksComponentSchema,
  DownloadFilesComponentSchema,
  UploadFilesComponentSchema,
  QuizTypeOneComponentSchema,
  QuizTypeTwoComponentSchema,
  QuizTypeThreeComponentSchema,
  QuizTypeFourComponentSchema,
  CoachingSessionComponentSchema,
  AssignmentComponentSchema,
]);

export const SaveLessonComponentsRequestSchema = z.object({
  lessonId: z.number(),
  courseVersion: z.number(),
  components: z.array(ComponentSchema)
});

export type TSaveLessonComponentsRequest = z.infer<typeof SaveLessonComponentsRequestSchema>;

export const SaveLessonComponentsSuccessResponseSchema = ListLessonComponentsSuccessResponseSchema;

export type TSaveLessonComponentsSuccessResponse = z.infer<typeof SaveLessonComponentsSuccessResponseSchema>;

const SaveLessonComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  ConflictError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'ConflictError',
    schema: z.object({
      trace: z.string().optional(),
      courseVersion: z.number(),
    }),
  }),
});
export type TSaveLessonComponentsUseCaseErrorResponse = z.infer<typeof SaveLessonComponentsUseCaseErrorResponseSchema>;

export const SaveLessonComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveLessonComponentsSuccessResponseSchema,
  SaveLessonComponentsUseCaseErrorResponseSchema,
]);

export type TSaveLessonComponentsUseCaseResponse = z.infer<typeof SaveLessonComponentsUseCaseResponseSchema>;
